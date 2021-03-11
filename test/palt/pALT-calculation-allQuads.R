library(data.table)
library(dplyr)

# input data
data <- '../../test-page/example2/allQuads.csv' %>%
    fread(
        sep = ',',
        na.strings = 'NA',
        colClasses = 'character'
    )

# data cleaning
data1 <- data %>%
    filter(!is.na(STUDYDAY) & !is.na(LBORRES)) %>%
    mutate(
        id = SUBJID,
        day = as.numeric(STUDYDAY),
        measure = TESTNAM,
        result = as.numeric(LBORRES),
        lln = as.numeric(LBORRESLO),
        uln = as.numeric(LBORRESHI),
        elevation = result > uln,
        elevation3 = result > uln*3
    ) %>%
    select(id, day, measure, result, lln, uln, elevation, elevation3) %>%
    distinct %>%
    group_by(id, measure) %>%
    arrange(day) %>%
    mutate(
        days = day %>% sort %>% paste(collapse = '|'),
        sequence = row_number()
    ) %>%
    ungroup %>%
    arrange(id, measure, day)

# identify first and last elevated results
elevation <- data1 %>%
    filter(elevation) %>%
    group_by(id, measure) %>%
    summarize(
        elev_st_dy = min(day),
        elev_en_dy = max(day),
        elev_st_seq = min(sequence),
        elev_en_seq = max(sequence)
    ) %>%
    ungroup
elevation3 <- data1 %>%
    filter(elevation3) %>%
    group_by(id, measure) %>%
    summarize(
        elev3_st_dy = min(day),
        elev3_en_dy = max(day),
        elev3_st_seq = min(sequence),
        elev3_en_seq = max(sequence)
    ) %>%
    ungroup

# merge elevation variables on original dataset
data2 <- data1 %>%
    left_join(
        elevation,
        by = c(
            'id' = 'id',
            'measure' = 'measure'
        )
    ) %>%
    left_join(
        elevation3,
        by = c(
            'id' = 'id',
            'measure' = 'measure'
        )
    ) %>%
    arrange(id, measure, day)

# summary calculations
auc <- data2 %>%
    filter(
        sequence >= (elev3_st_seq - 1) &
        sequence <= (elev3_en_seq + 1)
    ) %>%
    group_by(id, measure) %>%
    summarize(
        auc = sum(
            (result[1:n() - 1] + result[-1]) * (day[-1]*24 - day[1:n() - 1]*24) / 2 # (first n-1 results + last n-1 results) * (last n-1 study days - first n-1 study days) / 2
        ),
        max = max(result),
        lln = min(lln),
        uln = max(uln),
        days = paste(day, collapse = ', '),
        results = paste(result, collapse = ', ')
    ) %>%
    ungroup

# pALT calculation
pALT <- auc %>%
    filter(
        measure == 'ALT (SGPT)'
    ) %>%
    select(-measure) %>%
    mutate(
        pALT = auc * max ** 0.18 / 10 ** 5
    )

# output data
pALT %>%
    fwrite(
        './pALT-calculation-allQuads.csv',
        na = '',
        row.names = FALSE
    )