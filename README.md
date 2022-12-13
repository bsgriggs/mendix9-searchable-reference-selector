## Searchable Reference Selector for Mendix 9.13+

Mendix reference selector with a search bar and a clear button.

**If you are using Mendix 8.17 - 9.12**, please use the following widget or check older version in the marketplace. (The older version does *not* support reference sets or enumerations)  
https://github.com/bsgriggs/mendix8-searchable-reference-selector  
https://marketplace.mendix.com/link/component/116917  

| Dropdown Reference or Enum | Dropdown Reference Set |  
| ------------- | ------------- |  
| ![DropdownRef](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/dropdownRef.png)   | ![DropdownRefSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/listRefSet.png)   |  


| List On Page Reference or Enum | List On Page Reference Set |  
| ------------- | ------------- |  
| ![ListRef](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/listRef.png)   | ![ListRefSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/dropdownRefSet.png)   |  

*Note: checkboxes, radio buttons, or background color settings are independent. All can be used at any time*

## Features

-   Dropdown or list selection for enumerations, references or reference sets
-   Can use "Max Items" setting to limit objects retrieved at once **use if you encounter longer load times**
-   Filtering is done by the Mendix runtime instead of the browser
-   Button to clear the selection / all selections - can be disabled
-   Button to select all the options in a reference set - can be disabled
-   Option to make the content un-searchable - **allows you to show a dynamic list of checkboxes / radio buttons**
-   Option to render options as checkboxes, radio buttons, or a cell
-   Option to render attribute text, HTML content, or content from Mendix 
-   Option to render a reference set's values with either badges or as a comma separated list
-   Option to define your own filtering logic with a Microflow
-   Option to use either Contains or StartsWith functions
-   Ability to marked specific options as un-selectable
-   Ability to customize the icons
-   Support for arrow keys and enter key press
-   Searching auto-highlights the first record for easy selecting with the enter key

## Limitation

-   N/A

## Configuration  
The following settings are available for all Selection Types.  
![Domain](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/Domain.png)  
The label is that text next to the textbox while the placeholder is the text inside of the textbox when there is no search. 

Please see the following documentation based on the Selection Type you wish to use.
-   [Enumeration Selector](docs/Enumeration.md)
-   [Reference Selector](docs/Reference.md)
-   [Reference Set Selector](docs/ReferenceSet.md)

##Performance Issues?##
You likely have too many options trying to render at once. Here's some things to help address the problem:  
-   Try using the "Max Items" setting. This will limit the amount of options available on the first render and display the "More Results Text" at the end of the list. When a user searches for something, *it will still consider the options that are not rendered*
-   Try limiting the data source based on what you already know. For example, if your form is for selecting McDonald's locations. Make the user select a state or country first then use that information to limit the data source.
-   Too many badges displaying when you have a reference set? Use the "Max Reference Display" setting. This will only render the first x amount of badges then include (+x) for the number of remaining selected.
-   Only use the "Selectable Attribute" if you absolutely need it. Sometimes it is better to not display a record at all (e.g. adding xpath to the data source) instead of displaying it as un-selectable.

## Demo project

https://widgettesting105-sandbox.mxapps.io/p/searchable-reference-selector

## Issues, suggestions and feature requests

https://github.com/bsgriggs/mendix9-searchable-reference-selector/issues

This widget is open source. Feel free to clone the GitHub repository, make whatever changes you need, and submit a pull request! 
**Requires Node v14 and NPM v6 - if you already have a different version of Node / NPM, then download [NVM](https://github.com/nvm-sh/nvm) to switch between versions **

## Development and contribution

Benjamin Griggs
