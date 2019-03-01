# GifTastic

### Overview

This is a web paplication that provides some fun GIFs along side some TV show info. It is supposed to be solely a TV show related app. However, the GIF part is open to all queries by design choice. AFter all, we all need to look up some cat GIFs from time to time.

### Dev Tool Set
- HTML
- CSS / Bootstrap
- JavaScript / JQuery
- APIs
   * OMDB API
   * Giphy API
   * Google Knowledge Search API

### Components

1. **Topics Button**
   * Renders button on load from pre-determined set of TV show titles.
   * when clicked it displays TV show Info + related GIFs.
      * Will reset to first 10 GIFs found on Giphy when pressed.

2. **Search function**
   * User enters name of TV show and submit the query.
      * If empty string is submitted, the user is prompted to enter a TV show title.
      * If the query is not found to be a TV show title then an error message will display. This does not affect GIFs being displayed if there are entries found for the query. However, no new topics button will be rendered.
      * If the query is found to match a TV show title then TV show info, GIFs and a new button will be displayed.

3. **10 More Button**
   * User gets 10 more GIFs belong to the TV show title they are currently browsing.

4. **TV Show Info-tron**
   * Shows Title of TV show, rating, genre, years on air, IMDB rating, plot, and the stars.
   * Has 2 buttons with links
      * **Official Site** - only available if can be found through Google Knowledge Search API.
      * **IMDB link**

5. **GIFs**
   * Shows a still GIF that can be toggled to animate and back and forth.
   * Each has two clickable icon one for Save and one for Favorite (see below).
   * It also has the GIF title and GIF rating shown below.

6. **Save**
   * One click save button. It saves the animated GIF with the GIF title as the filename.
      * Tested only in Firefox and Chrome.

7. **Favorite**
   * One click favorite button: open heart = meh, solid hear == YEP MY FAVORITE.
      * WHen GIF is set as favorite it has a solid heart and is saved in the "my favorite section" on the left.
      * Two ways to remove GIF from favorite list
         * If the GIF is still displayed in the GIF section - click on heart to change from solid to open - will remove GIF from list
         * If the GIF is only displayed in the GIF section - click on heart to remove GIF from list
      * My favorite list presists until browser window closes.

### Unsolved Issue / Possible Improvements
1. All components to work corss browser and devices.
   * App is known to fail in IE. (JS / JQuery both doesn't run)
   * App untested in MAC and Apple mobile.
2. Would be great to not have the query form to have memories of previous submissions in Chrome -- This may be a Chorme thing?
3. Fuzzy search for TV show through OMDB API - using OMDB search result to populate topic button so it is spelled correctly
4. A floating scroll up button.
5. Option to remove Topic Buttons.
6. Make it so user cannot save the same favorite GIFs more than once.
7. prob best to change display from card-columns to card-rows (which will have to be manually made with css as this is not a default class in bootstrap)

