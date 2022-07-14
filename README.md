## Searchable Reference Selector for Mendix 9.13+

Mendix reference selector with a search bar and a clear button.

**If you are using Mendix 8.17 - 9.12**, please use the following widget.  
https://github.com/bsgriggs/mendix8-searchable-reference-selector  
https://marketplace.mendix.com/link/component/116917  

| Dropdown Reference | Dropdown Reference Set | List On Page Reference | List On Page Reference Set |
| ------------- | ------------- | ------------- | ------------- |
| ![DropdownRef]()   | ![ListRef]()   | ![DropdownRefSet]()   | ![ListRefSet]()   |  

*Note: checkboxes or background color selection are independent of Dropdown / List On Page. Both settings can use either*

## Features

-   Dropdown or list selection with any objects you want
-   **Supports Reference Sets** - displays current values either as badges or a comma seperated list
-   Selecting an option triggers a Mendix Action
-   Option to allow the user to clear the selection or not
-   Option to render options as checkboxes
-   Option to render attribute text, HTML content, or Mendix widget 
-   Ability to marked specific options as un-selectable
-   Support for arrow keys and enter key press
-   Searching auto-highlights the first record for easy selecting with the enter key

## Limitation

-   N/A 

## Configuration

![Domain]()  

The following is an example for using the widget on a page with a Transaction to set its association to Category  

![General]()  

![Style]()  

![Data Source]()  

## Usage

1. Add the widget inside a data view
2. Configure the "Selectable Objects" as the list object you want to appear in the dropdown
3. Set the "Attribute to Display" as the attribute on the Selectable Objects you want to display in the dropdown

6. Run the project and play with the remaining setting to see what you need!

## Demo project

https://widgettesting105-sandbox.mxapps.io/p/searchable-reference-selector?profile&#61;Responsive

## Issues, suggestions and feature requests

https://github.com/bsgriggs/mendix9-searchable-reference-selector/issues

## Development and contribution

Benjamin Griggs
