### Manual Filtering
The following documentation is for using Selection Type "Reference Set" or "Reference" with Manual filtering. If you need another selection type, see the documentation at these links:
-   [Enumeration Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Enumeration.md)
-   [Reference Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Reference.md)
-   [Reference Set Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ReferenceSet.md)

### Filtering Settings  
![filteringSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/filertingReference%26Set.png)  
**Filter Delay** - The number of milliseconds between the user's last typing and applying the search criteria. This is an important performance optimization, so be sure not to set the value too low!  
**Filter Type** - How the filtering is handled. Auto mode uses the Mendix [ListValue API](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-client-apis-list-values/) to optimize memory management. Manual mode will allow you to set the user's search text as an attribute on the page then use that attribute inside the data source microflow. Manual mode changes many settings about the widget with the expectation that you will add them to you microflow. See the documentation [here](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ManualFiltering.md) for details.  
**Filter Function** - How the user's text is used to filter the results list. Contains mode will return any options where an exact match is found at any point in the option's text. Starts With mode will return options that have an exact match at the beginning of the option's text.  
Starts With can help with performance, but it can be bad UX. For example, displaying a list of user full names would not work, because the user may enter the last name instead of the first name.  


### Domain Model
You will need to create a non-persistent entity with the same attributes as this SearchHelper  
![searchHelper](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/searchHelper.png)

For the example in this documentation, consider the following domain model. The page object will be a Transaction while the user will be searching / selecting a Category object across the association Transaction_Category.

![domain](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/domain.png)  
