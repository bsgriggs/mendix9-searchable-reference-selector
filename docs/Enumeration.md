## Enumeration Selector
The following documentation is for using Selection Type "Enumeration" with Automatic filtering under the Data Source tab. If you need another selection type, see the documentation at these links:
-   [Enumeration Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Enumeration.md)
-   [Reference Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Reference.md)
-   [Reference Set Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ReferenceSet.md)

Check [here](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ManualFiltering.md) for more information on using manual filtering. Many of the options are removed with the expectation you will be adding the features manually in you microflow data source.  

### Customization Settings  
![customizationEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/customizationEnum.png)  
**Searchable?** - Allow the user to filter the results by entering a search string. When disabled, the text box is read only. Disabling searchability can be useful when using Select Style "List on Page" and you have a limited set of results. The user would then see a simple list on the page of available options.  
**Clearable?** - Allow the user to remove all selections / set the association as empty. You could disable this setting if you want the user to *always* have at least 1 selection.  

### Text Settings
![customizationEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/textEnum.png)  
**Label** - MxLabel displayed near the textbox.  
**Placeholder** - Text shown in the text box when there is no current value or current search.  
**No Results Text** - Text displayed if there are no results. (i.e. either the data source returned nothing or the user enters a search text and nothing is found)  

### Styling Settings  
![styleEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/styleEnum.png)  
**Select Style** - The results are either displayed in a dropdown when the user clicks on the textbox or the results are always displayed on the page in a list.  
**Option Style** - Method of showing the selected options to the user. Cell mode will show the selected options with a background color while radio buttons mode will show (guess what) radio buttons.  
**Max Menu Height** - (Dropdown Only) String expression for the CSS Height for the dropdown menu with a default of 15em.  
**Icons** - Override the default icons with your own glyphicon / images  

### Data Source Settings  
![dataSource](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/dataSourceEnum.png)  
**On Change** - Perform an MxAction when the user adds or removes a selection.  
**On Leave** - Perform an MxAction when the user clicks away or tabs away.  

### Filtering Settings  
![filteringEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/filteringEnum.png)  
**Filter Delay** - The number of milliseconds between the user's last typing and applying the search criteria. This is an important performance optimization, so be sure not to set the value too low!  
**Filter Function** - How the user's text is used to filter the results list. Contains mode will return any options where an exact match is found at any point in the option's text. Starts With mode will return options that have an exact match at the beginning of the option's text.  
Starts With can help with performance, but it can be bad UX. For example, displaying a list of user full names would not work, because the user may enter the last name instead of the first name.  
