# Interactive Safety eDISH graphic
Evaluation of Drug-Induced Serious Hepatotoxicity (eDISH) plots are a key tool used to assess liver toxicity in clinical trials.
A live demo using sample data is [available here](https:/safetygraphics.github.io/safety-eDISH/test-pages/example1) and shown below.

![edishgif](https://user-images.githubusercontent.com/3680095/45834450-02b3a000-bcbc-11e8-8172-324c2fe43521.gif)

## Background
Standard properties and workflows for static eDish plots are well documented  by [Watkins et al.](https://link.springer.com/article/10.2165%2F11586600-000000000-00000),  [Merz et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4212156/) and others.
This library contains a web-based implementation of the traditional eDISH plot that allows a user to interactively explore participant data in ways that are not possible in static plots.

## Interactive Functionality
Just like the standard eDish plot, the default view for this chart shows one point per participant with maximal alanine transaminase (ALT) and total bilirubin (TB) over the course of the study plotted on the x- and y-axes, respectively (see "Population View" below).
Clicking on a participant's circle displays additional details for that individual (see "Details View").  

### Population View
<img width="686" alt="screen shot 2018-05-11 at 11 54 07 am" src="https://user-images.githubusercontent.com/3680095/39941805-928ff78a-5512-11e8-8d11-589f7616c807.png">

*Feature List*

1. Interactive Hy's law quadrants + summary table
2. Points filled based on time between maximal values
3. Marginal distribution box plots (coming soon)
4. Click a point to view a hysteresis plot of the selected participant as well as a summary their demographic and medical signs data
5. Interactive grouping
6. Toggle between results relative to the upper limit of normal and to baseline result
7. Size points with a third measure
8. Toggle between linear and log axes
9. Interactive data filtering

### Details View
<img width="493" alt="screen shot 2018-05-11 at 12 20 03 pm" src="https://user-images.githubusercontent.com/3680095/39942873-c109a95a-5515-11e8-8ddc-95cb9b873c64.png">

*Feature List*

1. Hysteresis plot ("snake plot") showing participant's lab values over time
2. Participant details section
  1. Demographic summary
  2. Spaghetti plot of selected measures
  3. Lab summary table with spark lines
