## Reference Selector
The following documentation is for using Selection Type "Reference" with Automatic filtering under the Data Source tab. If you need another selection type, see the documentation at these links:
-   [Enumeration Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Enumeration.md)
-   [Reference Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Reference.md)
-   [Reference Set Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ReferenceSet.md)

Check [here](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ManualFiltering.md) for more information on using manual filtering. Many of the options are removed with the expectation you will be adding the features manually in you microflow data source.  

### Customization Settings  
![customizationRef](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/customizationRef.png)  
**Searchable?** - Allow the user to filter the results by entering a search string. When disabled, the text box is read only. Disabling searchability can be useful when using Select Style "List on Page" and you have a limited set of results. The user would then see a simple list on the page of available options.  
**Clearable?** - Allow the user to remove all selections / set the association as empty. You could disable this setting if you want the user to *always* have at least 1 selection.  
**Max Items** - Integer expression for the limit of records to display at once. **Very important setting if you encounter performance issues**. If the value is set to 0, then no limit will be applied.  
**More Results Text** - Text displayed at the end of the results list if there are more results than the Max Items. This text is to inform the user that they need to enter search criteria to view more records. *If Max Items is set to 0, then this setting is not available because all records are always shown.*  
**No Results Text** - Text displayed if there are not results. (i.e. either the data source returned nothing or the user enters a search text and nothing is found)  

### Styling Settings  
![styleRef](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/styleRef.png)  
**Select Style** - The results are either displayed in a dropdown when the user clicks on the textbox or the results are always displayed on the page in a list.  
**Option Text Type** - Method of rendering the text. Text shows the value of the attribute selected. HTML will render the value inside a span using **dangerouslySetInnerHTML**. Because of this, you need to make sure the HTML content is sanitized and cannot have any malicious javascript. Custom mode will add a container for you to add any content once you save the widget settings. This is useful for displaying multiple attributes in the same option, but the filtering will only consider the attribute set in the Data Source tab. *If you need to filter on multiple attribute too, see the [Manual Filtering](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ManualFiltering.md) documentation.*  
**Option Style** - Method of showing the selected options to the user. Cell mode will show the selected options with a background color while radio buttons mode will show (guess what) radio buttons.  
**Max Menu Height** - (Dropdown Only) String expression for the CSS Height for the dropdown menu with a default of 15em.  
**Icons** - Override the default icons with you own glyphicon / images  

### Data Source Settings  
![dataSource](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/dataSourceRef.png)  
**Selectable Condition** - Optional boolean expression for rendering an option as un-selectable. Useful if you want to display an option, but not allow the user to select it for a reason. For example, show a list of all users but do not allow inactive users to be selected.  
**On Change** - Perform an MxAction when the user adds or removes a selection.  
**On Leave** - Perform an MxAction when the user clicks away or tabs away.  

### Filtering Settings  
![filteringSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/filteringReference%26Set.png)  
**Filter Delay** - The number of milliseconds between the user's last typing and applying the search criteria. This is an important performance optimization, so be sure not to set the value too low!  
**Filter Type** - How the filtering is handled. Auto mode uses the Mendix [ListValue API](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-client-apis-list-values/) to optimize memory management. Manual mode will allow you to set the user's search text as an attribute on the page then use that attribute inside the data source microflow. Manual mode changes many settings about the widget with the expectation that you will add them to you microflow. See the documentation [here](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ManualFiltering.md) for details.  
**Filter Function** - How the user's text is used to filter the results list. Contains mode will return any options where an exact match is found at any point in the option's text. Starts With mode will return options that have an exact match at the beginning of the option's text.  
Starts With can help with performance, but it can be bad UX. For example, displaying a list of user full names would not work, because the user may enter the last name instead of the first name. *(Note: using the contains function does NOT apply database indexes. If you encounter performance issues, consider using startsWith instead.)*
