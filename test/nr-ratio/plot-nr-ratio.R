plot_nr_ratio <- function(
    data,
    id_value,
    x = 'day',
    y = 'nr_ratio'
) {
    require(dplyr)
    require(ggplot2)
    
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
