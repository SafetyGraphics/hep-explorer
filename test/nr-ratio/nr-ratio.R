# Generates longitudinal nR ratio plots for each ID in example data.

library(data.table)
library(dplyr)
library(tidyr)
library(ggplot2)

# Input data.
all_quads <- '../../test-page/example2/allQuads.csv' %>%
    fread(
        sep = ',',
        na.strings = 'NA',
        colClasses = 'character'
    ) %>%
    mutate(
        source = 'allQuads'
    )
palt_adlbc <- '../../test-page/example5/palt_adlbc.csv' %>%
    fread(
        sep = ',',
        na.strings = 'NA',
        colClasses = 'character'
    ) %>%
    mutate(
        source = 'palt_adlbc'
    )
data <- all_quads %>%
    bind_rows(palt_adlbc) %>%
    mutate(
        id = coalesce(USUBJID, SUBJID),
        visit = coalesce(VISIT, AVISIT) %>% toupper,
        day = as.numeric(coalesce(STUDYDAY, ADY)),
        measure = coalesce(TESTNAM, PARAM),
        measure = case_when(
            measure %in% c('ALT (SGPT)', 'Alanine Aminotransferase (U/L)') ~ 'Alanine Transaminase',
            measure %in% c('AST (SGOT)', 'Aspartate Aminotransferase (U/L)') ~ 'Aspartate Transaminase',
            measure %in% c('Total Bilirubin', 'Bilirubin (umol/L)') ~ 'Total Bilirubin',
            measure %in% c('Alkaline Phosphatase', 'Alkaline Phosphatase (U/L)') ~ 'Alkaline Phosphatase',
            TRUE ~ measure
        ),
        measure_code = coalesce(LBTESTCD, PARAMCD),
        result = as.numeric(coalesce(AVAL, LBORRES)),
        lln = as.numeric(coalesce(LBORRESLO, A1LO)),
        uln = as.numeric(coalesce(LBORRESHI, A1HI)),
        x_uln = result/uln
    ) %>%
    filter(
        measure %in% c('Alanine Transaminase', 'Aspartate Transaminase', 'Total Bilirubin', 'Alkaline Phosphatase') &
        !is.na(result) &
        source == 'allQuads'
    ) %>%
    select(id, visit, day, measure, measure_code, result, lln, uln, x_uln) %>%
    group_by(id, day, visit, measure, measure_code) %>%
    arrange(id, day, visit, measure, measure_code) %>%
    summarize(
        result = mean(result),
        lln = mean(lln),
        uln = mean(uln),
        x_uln = mean(x_uln)
    ) %>%
    ungroup

# Calculate nR ratio.
nr_ratio <- data %>%
    pivot_wider(
        id_cols = c('id', 'day', 'visit'),
        names_from = 'measure_code',
        values_from = 'x_uln'
    ) %>%
    mutate(
        r_ratio = ALT/ALP,
        alt_ast = pmax(ALT, AST, na.rm = TRUE),
        nr_ratio = alt_ast/ALP,
        alf = nr_ratio > 5 & BILI > 2
    )

# Output data.
nr_ratio %>%
    fwrite(
        './nr-ratio.csv',
        na = '',
        row.names = FALSE
    )

# Output one nR ratio plot per ID.
nrRatioPlot <- function(data, id_value, x = 'day', y = 'nr_ratio') {
    id_data <- data %>%
        filter(id == id_value)
    
    id_data %>%
        ggplot(
            aes(
                x = !!sym(x),
                y = !!sym(y)
            )
        ) +
        geom_line() +
        geom_point() +
        scale_y_continuous(
            limits = c(0, max(5, max(id_data[y], na.rm = TRUE)))
        )
}

for (id in unique(nr_ratio$id)) {
    nrRatioPlot(nr_ratio, id)
    ggsave(paste0('./output/', id, '.pdf'))
}