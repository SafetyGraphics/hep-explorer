library(magrittr)
library(data.table)

source('./calculate-nr-ratio.R')
source('./plot-nr-ratio.R')

set.seed(8675309)

####################################################################################################
# Dataset 1
####################################################################################################

    # get data
    palt_adlbc <- '../../test-page/example5/palt_adlbc.csv' %>%
        fread

    # calculate nR-ratio
    nr_ratio_palt_adlbc <- calculate_nr_ratio(palt_adlbc)

    # plot a small sample of IDs
    ids_palt_adlbc <- sample(unique(nr_ratio_palt_adlbc$id), 10)
    for (id in ids_palt_adlbc) {
        plot_nr_ratio(
            nr_ratio_palt_adlbc,
            id
        )
        ggsave(paste0('./output/', id, '.pdf'))
    }

    # compare with hep-explorer calculations
    production_palt_adlbc <- './production-data/eDish_nrRatioData_testing_palt_adlbc.csv' %>%
        fread %>%
        rename(
            nr_ratio = value
        ) %>%
        select(id, day, nr_ratio) %>%
        arrange(id, day)

    validation_palt_adlbc <- nr_ratio_palt_adlbc %>%
        filter(!is.na(nr_ratio)) %>%
        select(id, day, nr_ratio) %>%
        arrange(id, day)

    comparison_palt_adlbc <- production_palt_adlbc %>%
        full_join(
            validation_palt_adlbc,
            by = c(
                'id' = 'id',
                'day' = 'day'
            )
        ) %>%
        filter(
            nr_ratio.x != nr_ratio.y
            | (is.na(nr_ratio.x) & !is.na(nr_ratio.y))
            | (is.na(nr_ratio.y) & !is.na(nr_ratio.x))
        )

    # save data
    saveRDS(nr_ratio_palt_adlbc, './validation-data/nr-ratio-palt_adlbc.Rds')
    fwrite(nr_ratio_palt_adlbc, './validation-data/nr-ratio-palt_adlbc.csv')
    fwrite(comparison_palt_adlbc, './validation-data/comparison_palt_adlbc.csv')

####################################################################################################
# Dataset 2
####################################################################################################

    # get data
    allQuads <- '../../test-page/example2/allQuads.csv' %>%
        fread

    # calcualte nR-ratio
    nr_ratio_allQuads <- calculate_nr_ratio(
        allQuads,
        id_col = 'SUBJID',
        visit_col = 'VISIT',
        day_col = 'STUDYDAY',
        measure_col = 'TESTNAM',
        measure_code_col = 'LBTESTCD',
        result_col = 'LBORRES',
        lln_col = 'LBORRESLO',
        uln_col = 'LBORRESHI'
    )

    # plot a small sample of IDs
    ids_allQuads <- sample(unique(nr_ratio_allQuads$id), 10)
    for (id in ids_allQuads) {
        plot_nr_ratio(
            nr_ratio_allQuads,
            id
        )
        ggsave(paste0('./output/', id, '.pdf'))
    }

    # compare with hep-explorer calculations
    production_allQuads <- './production-data/eDish_nrRatioData_testing_allQuads.csv' %>%
        fread %>%
        rename(
            nr_ratio = value
        ) %>%
        select(id, day, nr_ratio) %>%
        arrange(id, day)

    validation_allQuads <- nr_ratio_allQuads %>%
        filter(!is.na(nr_ratio)) %>%
        select(id, day, nr_ratio) %>%
        arrange(id, day)

    # ID 4062-20 has duplicate records.
    comparison_allQuads <- production_allQuads %>%
        full_join(
            validation_allQuads,
            by = c(
                'id' = 'id',
                'day' = 'day'
            )
        ) %>%
        filter(
            nr_ratio.x != nr_ratio.y
            | (is.na(nr_ratio.x) & !is.na(nr_ratio.y))
            | (is.na(nr_ratio.y) & !is.na(nr_ratio.x))
        )

    # save data
    saveRDS(nr_ratio_allQuads, './validation-data/nr-ratio-allQuads.Rds')
    fwrite(nr_ratio_allQuads, './validation-data/nr-ratio-allQuads.csv')
    fwrite(comparison_allQuads, './validation-data/comparison_allQuads.csv')