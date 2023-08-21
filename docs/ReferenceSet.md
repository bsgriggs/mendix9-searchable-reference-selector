# Reference Set Selector
The following documentation is for using Selection Type "Reference Set" with Automatic filtering under the Data Source tab. If you need another selection type, see the documentation at these links:
-   [Enumeration Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Enumeration.md)
-   [Reference Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Reference.md)
-   [Reference Set Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ReferenceSet.md)

Check [here](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ManualFiltering.md) for more information on using manual filtering. Many of the options are removed with the expectation you will be adding the features manually in your microflow data source.

## When using reference sets, make sure that the page object is the owner of the association!!!  
In the example below, the page would have a Project object and the user selects the Project's Employee(s).  
![Data Source](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/referenceSetOwnerExample.png)  

*Note: the owner of an association is denoted by which side(s) of the line has the black circle.*

## General Settings
![generalEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/generalSet.png)  
### Label
**Label** - Mendix label, displayed either horizontally or vertically to the input based on your parent data view's settings.  
**Placeholder** - The text that is shown while no options are selected.  

### Data source
**Selection type** - The attribute or association type that the widget is expected to set.  
**Selectable objects** - The data source that determines the list of options.  
**Reference set** - The association that will be set when the user selects an option.  
**Option selectable?** - Optional boolean expression for rendering an option as un-selectable. Useful if you want to display an option, but not allow the user to select it for a reason. For example, show a list of all users but do not allow inactive users to be selected.  
**Option content type** - Determines how each option is rendered.  
- "Text" and "HTML" will require an attribute to be selected called "Option content". **Option content** - a string or enum attribute on the entity returned by the Selectable Objects. **WARNING - selecting an enum attribute will force the widget to use less-efficient client-side filtering and should be avoided if possible.**  
- "Expression" will require a string expression to be entered and is useful if you need to concatenate multiple attributes (e.g. employee name and employee id). You will have to select at least 1 search attribute in the search attributes list below.  
- "Custom" - Studio Pro will add a new container below the widget where you can add Mendix widgets for each option. You could, for example, have employee profile pictures next to each of their names. You will have to select at least 1 search attribute in the search attributes list below.  

| "Custom" - Studio Pro | "Custom" - Browser |  
| ------------- | ------------- |  
| ![studioProOptionContentType](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/optionContentTypeCustom.png)    | ![BrowserOptionContentType](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/optionContentTypeCustomUI.png)    |  

### Searching
**Searchable?** - Whether or not the user can search for a value.  
**Search delay** - The number of milliseconds between the user's last typing and applying the search criteria. This is an important performance optimization, so be sure not to set the value too low!  
**Search type** - How the searching is handled. 
- "By Attribute(s)" uses the Mendix [ListValue API](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-client-apis-list-values/) to do optimal server-side filtering.
- "By Data Source Microflow" will allow you to get the user's search text as an attribute on the page and then use that attribute inside the data source Microflow to filter the options however you want. If you want to use this mode, see details [here](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ManualFiltering.md).

**Search function** - How the user's text is used to filter the results list. Contains mode will return any options where an exact match is found at any point in the option's text. Starts With mode will return options that have an exact match at the beginning of the option's text.  

*Starts With can help with performance but it can be bad UX depending on the use case. For example, displaying a list of user full names would not work, because the user may enter the last name instead of the first name.*  

If you used Option Content Type "Expression" or "Custom" you will a new option called "Search attributes". At least 1 search attribute is required.  
![generalEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/generalSetExpression.png)  
**Search attributes** - The list of attributes that are used to filter each option. For example, the user can enter "Bob" and it will check if either the Name or Region attributes contain "bob". **WARNING - selecting an enum attribute will force the widget to use less-efficient client-side filtering and should be avoided if possible.**   

## Style Settings
![generalEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/styleSet.png) 
### General
**Select style** - Determines if the options menu displays as a dropdown on-click or is always shown as a list on the page.  
**Option style** - Determines the style of the selected options. Choose between checkboxes or cells with a grey background color.  
| Cell | Checkboxes |  
| ------------- | ------------- |  
| ![DropdownRefSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/demoListSet.png)   | ![ListRefSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/demoDropSet.png)   |  

**Max items** - An integer expression that sets the limit of items shown at a time. 
- If 0, no limit is set.
- If there are more options available than the limit, the widget will show the More Results Text. Clicking on the More Results Text will increase the limit and show more of the items.
- *If the Option Content or Search Attributes settings contain an enumeration, the widget will still limit the items but the user will be able to click show more items.*

**Allow loading select** - Allows the user to select an option while the data source is still loading (i.e. the time between typing and the Selectable Objects data source returning the results). 
- This is useful if the user notices the option they're looking for after they started typing.
- This should be disabled if the Selectable Objects data source is dependent on another widget on the page. For example, you're showing a list of countries and a list of McDonald's. When the user selects a country, the McDonald's list only shows locations in that country. The widget must not allow the user to select an option while loading; otherwise, the user could quickly change the country and then select a McDonald's from the previous country's list before the widget has time to update.

**Max menu height** - A string expression for CSS height for the dropdown. Defaults to 15em. (only for Select Style = "Dropdown").  
**Dropdown icon** - Override the default dropdown icon with your own glyphicon or images.  

### Reference set options
**Clear search on select** - Resets the search text to empty when the user clicks an option.  
**Selected values style** - How the selected items are displayed. Can be Badges (Left below) or Commas (Right below).  
![selectedValuesStyleUI](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/selectedValuesStyleUI.png)  

**Compact?** - Makes the search text in the same line as the badges or commas. (Yes = left image, No = right image)  
![compact](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/compact.png)  

**Selected values content** - Determines the content of the badges or commas. Can be either "Same as option" or "Custom". For "Custom", Studio Pro will add a new container below the widget where you can add Mendix widgets for each value. This can be used to save space in the list of the current values.  
| "Custom" - Studio Pro | "Custom" - Browser |  
| ------------- | ------------- |  
| ![customStudioPro](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/selectedValuesContent.png)    | ![customBrowser](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/selectedValuesContentUI.png)    |  

**Badge color** - The background color of the badges. Can be Default, Info, Primary, Inverse, Success, Warning, or Danger. These options follow your brand stylesheet.  
![badgeColorUI](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/badgeColorUI.png)  
**Max displayed** - The limit of badges or commas to show at once. If the value is set to 0 (the default), then no limit is applied. The remainder is shown as "(+n)".  
![maxDisplayedUI](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/maxDisplayedUI.png)  

## Customization Settings  
![customizationEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/customizationSet.png)  
### Text
**More Results Text** - Text displayed at the end of the results list if there are more results than the Max Items. This text is to inform the user that they need to enter search criteria to view more records. *If Max Items is set to 0, then this setting is not available because all records are always shown.*  
**No Results Text** - Text displayed if there are no results. (i.e. either the data source returned nothing or the user enters a search text and nothing is found)  
**Loading Text** - Text shown while the data source is still loading.  

### Select all
**Show select all?** - Shows an icon that when clicked will select all options visible in the dropdown.  
**Select all icon text** - Tooltip text for the select all icon.  
**Select all icon** - Override the default select all icon with your own glyphicon or images.  

### Clearing
**Clearable?** - Allows the user to set the value as empty.  
**Clear icon text** - Tooltip text for the clear icon.  
**Clear icon** - Override the default clear icon with your own glyphicon or images.  

## Events Settings
![eventsSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/eventsSet.png)  
**On Change** - Perform an MxAction when the user selects an option different from the current value.  
**On Leave** - Perform an MxAction when the user clicks or tabs away from the input.  
**On Value Click** - Perform an MxAction when the user clicks on one of the currently selected values. Can be used to show an Edit page for the select object (as long as the save button does a 'refresh in client').  
**On Extra Click** - Perform an MxAction when the user clicks on the (+n) text. Can be used to show a list of all selected values in a popup.

## Accessibility
![accessibilityRef&Set](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/accessibilityRef&Set.png)  
**Aria live text** - The text read by a screen reader when an option is selected or highlighted. If no value is set, the widget will default to the Option Content attribute or the Option Expression. If you're using Option Content Type "Custom", then this text is the only way the screen reader knows what text to read for the option.  

## Common Settings  
![common](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/common.png)  
**Name** - Mendix name for the widget.  
**Tab index** - The tab order of the widget. This should be left at 0 for most situations.  
**Visible** - Boolean expression that determines if the widget is rendered at all.  
**Editable** - Boolean expression that determines if the user is allowed to select a value.  
