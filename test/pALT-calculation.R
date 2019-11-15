library(data.table)
library(dplyr)

# input data
data <- '../test-page/example2/allQuads.csv' %>%
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
        result = as.numeric(LBORRES)
    ) %>%
    select(id, day, measure, result) %>%
    arrange(id, day, measure)

# summary calculations
auc <- data1 %>%
    group_by(id, measure) %>%
    filter(day >= 1) %>% # including baseline
    summarize(
        auc = sum(
            (result[1:n() - 1] + result[-1]) * (day[-1] - day[1:n() - 1]) / 2 # (first n-1 results + last n-1 results) * (last n-1 study days - first n-1 study days) / 2
        ),
        max = max(result),
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
        './pALT.csv',
        na = '',
        row.names = FALSE
    )