## Searchable Reference Selector for Mendix 9.13+

Mendix reference selector with a search bar and a clear button.

**If you are using Mendix 8.17 - 9.12**, please use the following widget or check older version in the marketplace.  
https://github.com/bsgriggs/mendix8-searchable-reference-selector  
https://marketplace.mendix.com/link/component/116917  

| Dropdown Reference | Dropdown Reference Set | List On Page Reference | List On Page Reference Set |
| ------------- | ------------- | ------------- | ------------- |
| ![DropdownRef](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/dropdownRef.png)   | ![DropdownRefSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/listRefSet.png)   | ![ListRef](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/listRef.png)   | ![ListRefSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/dropdownRefSet.png)   |  

*Note: checkboxes, radio buttons, or background color settings are independent. All can be used at any time*

## Features

-   Dropdown or list selection with any objects you want
-   Sets the association directly - no longer required to use an on change Microflow
-   **Supports Reference Sets** - displays current values either as badges or a comma separated list
-   Can use "Max Items" setting to limit objects retrieved at once **use if you encounter longer load times**
-   Filtering is done by the Mendix runtime instead of the browser - more efficient 
-   Button to clear the selection / all selections - can be disabled
-   Button to select all the options in a reference set - can be disabled
-   Option to make the content un-searchable - **allows you to show a dynamic list of checkboxes / radio buttons**
-   Option to render options as checkboxes, radio buttons, or a cell
-   Option to render attribute text, HTML content, or content from Mendix 
-   Option to render a reference set's values with either badges or as a comma separated list
-   Ability to marked specific options as un-selectable
-   Ability to customize the icons
-   Support for arrow keys and enter key press
-   Searching auto-highlights the first record for easy selecting with the enter key

## Limitation

-   N/A

## Configuration

![Domain](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/Domain.png)  

The following is an example for using the widget on a page with a Transaction to set its association set to TestObjs  

![General](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/General.png)  

![Style](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/Style.png)  

![Data Source](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/DataSource.png)  

**When using reference sets, make sure that the page object is the owner of the association!!!**  
In the example below, imagine your page has a QuestionConfig object and you want to select its OptionConfigs. You must use the QuestionConfig_OptionConfig association. If your page object is OptionConfig and you need to set its QuestionConfigs, use the OptionConfig_QuestionConfig association.  

![Data Source](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/referenceSetOwner.png)  

*In the real world, you should only have 1 of these associations. Either decide which object should be the owner or set the association as "refer to each other"*

## Usage

1. Add the widget inside a data view. 
2. Inside the Data Source tab, configure the "Selectable Objects" as the object you want to appear in the dropdown.  
3. Configure the "Reference" as the path from the page object to the "Selectable Objects".  
4. Decide whether you want to display an attribute, HTML content, or custom content.  
  4a. Attribute - Set the "Attribute to Display" as the appropriate string or enumeration.  
  4b. HTML - Set the "Attribute to Display" as the string on the selectable object that contains the HTML. In the Style tab, change "Option Text Type" to HTML.  
  4c. Custom - Set the "Attribute to Display" as the attribute you want the user to search against. In the Style tab, change "Option Text Type" to Custom then click okay. On the Mendix page, you should see a container to build out your own content.  
5. Run the project and play with the remaining setting to see what you like!  

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
