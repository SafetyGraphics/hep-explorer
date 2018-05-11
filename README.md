# Interactive Safety eDISH graphic

# Background

Evaluation of Drug-Induced Serious Hepatotoxicity, or eDISH, plots are a key tool used to assess liver toxicity in clinical trials. Standard properties and workflows for static eDish plots are well documented  by [Watkins et al.](https://link.springer.com/article/10.2165%2F11586600-000000000-00000),  [Merz et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4212156/) and others. This library contains a web-based implementation of the traditional eDISH plot that allows a user to interactively explore participant data in ways that are not possible in static plots. 

## Interactive Functionality

Just like the standard eDish plot, the default view for this chart shows one point per participant with maximal ALT and TB over the course of the study plotted on the x and y axes respectively (see "Population View" below).  Clicking on a participant circle displays additional details for that individual (see "Details View").  

### Population View
<img width="686" alt="screen shot 2018-05-11 at 11 54 07 am" src="https://user-images.githubusercontent.com/3680095/39941805-928ff78a-5512-11e8-8d11-589f7616c807.png">

*Feature List*

1. Interactive Hy’s law quadrants + summary table
2. Points filled based on baseline ALP
3. Toggle between relative and absolute measures
4. Interactive grouping
5. Interactive filters
6. Links to external population profiles
7. Marginal distribution box plots (coming soon)
8. Point details on hover 
9. Participant measures across time points on hover
10. Click a point for participant details (see below)

### Details View
<img width="493" alt="screen shot 2018-05-11 at 12 20 03 pm" src="https://user-images.githubusercontent.com/3680095/39942873-c109a95a-5515-11e8-8ddc-95cb9b873c64.png">

*Feature List*

1. Hysteresis plot (“snake plot”) showing participant’s lab values over time. 
2. Participant details section with link to external participant profile
3. Demographic summary
4. Lab summary table with spark lines
