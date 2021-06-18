# Calculate nR-ratio.
calculate_nr_ratio <- function(
    data,
    id_col = 'USUBJID',
    visit_col = 'AVISIT',
    day_col = 'ADY',
    measure_col = 'PARAM',
    measure_code_col = 'PARAMCD',
    result_col = 'AVAL',
    lln_col = 'A1LO',
    uln_col = 'A1HI'
) {
    require(dplyr)
    require(tidyr)

    data_forged <- data %>%
        rename(
            id = !!sym(id_col),
            visit = !!sym(visit_col),
            day = !!sym(day_col),
            measure_code = !!sym(measure_code_col),
            result = !!sym(result_col),
            lln = !!sym(lln_col),
            uln = !!sym(uln_col)
        ) %>%
        mutate(
            measure = case_when(
                grepl('alt|sgpt|alanine', !!sym(measure_col), TRUE) ~ 'Alanine Transaminase',
                grepl('ast|sgot|aspartate', !!sym(measure_col), TRUE) ~ 'Aspartate Transaminase',
                grepl('(?<!direct )bilirubin', !!sym(measure_col), TRUE, TRUE) ~ 'Total Bilirubin',
                grepl('phosphatase', !!sym(measure_col), TRUE) ~ 'Alkaline Phosphatase',
                TRUE ~ !!sym(measure_col)
            ),
            x_uln = result/uln
        ) %>%
        filter(
            measure %in% c('Alanine Transaminase', 'Aspartate Transaminase', 'Total Bilirubin', 'Alkaline Phosphatase')
            & !is.na(result)
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

    nr_ratio <- data_forged %>%
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
    
    return(nr_ratio)
}