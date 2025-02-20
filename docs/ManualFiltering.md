# Manual Filtering
The following documentation is for using Selection Type "Reference Set" or "Reference" with Manual filtering (AKA Search Type = "By Data Source Microflow"). This mode allows you to get the user's search text as an attribute on the page and then use that attribute inside the data source Microflow to filter the options however you want. It is also useful to fill the options from an API or to make custom functionality like only searching if the user entered 3 or more characters.  

If you don't plan to use manual filtering, see the documentation at these links based on your selection type:
-   [Enumeration Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Enumeration.md)
-   [Boolean Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Boolean.md)
-   [Reference Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Reference.md)
-   [Reference Set Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ReferenceSet.md)

*Note: you no longer need to use manual filtering to search multiple attributes at the same time. See the Option Content Type documentation for reference or reference sets above.*

## Domain Model
You will need to create a non-persistent entity with the following attributes:  
![searchHelper](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/searchHelper.png)

For the example in this documentation, consider the following domain model. The page object will be a Project while the user will be searching / selecting a Employee objects across the association Project_Employee.  
![domain](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/domain.png)  

## Page Setup  
You need to wrap your widget with a data view that creates a SearchHelper object.  
![manualPage](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/manualPage.png)  

*I'm using Option Text Type Custom to display both the Employee's Name and Employee's ID in the same line*

## Data Source  
When using Manual Filtering, your data source **MUST** be either a nanoflow or a microflow. Inside that flow, you should have logic similar to the following.  
![filteringManualDataSource](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/manualDataSource.png)  

1. Create a variable with the trimmed text that the user entered. **trim($SearchHelper/SearchText)**
2. Retrieved from database the objects you need. Apply the pagination options if required. For this example, I want the user to be able to search for either an Employee's name or an Employee's ID. *(Note: using the contains function in xpath does NOT apply database indexes. If you encounter performance issues, consider using startsWith() instead.)*  
![manualRetrieve](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/manualRetrieve.png)  
*(The following steps are only if you want to limit the search results. If you do not want to limit the search results, skip to step 7)*  
3. Add another retrieve with the same XPath constrant as the first retrieve but set the range to all.  
4. Add Aggregate List activity that performs a count on the list directly before them. *(Dev Tip: having an Aggregate List activity directly following a retrieve performs a database count instead of retrieving the results and counting the length of the array. You can read more [here](https://docs.mendix.com/refguide/aggregate-list/#5-optimizing-aggregate-activities).)*  
5. Add a change object activity that changes SearchHelper.hasMoreResults with the expression **$Count > $SearchHelper/PageSize**.  
6. Set the return value as the FIRST retrieved list. Using the second retrieves will break the database optimization mentioned in #4.  

## Filtering Settings  
![searchTypeByDataSourceMicroflow](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/searchTypeByDataSourceMicroflow.png)  
**Searchable?** - Whether or not the user can search for a value.  
**Search delay** - The number of milliseconds between the user's last typing and applying the search criteria. This is an important performance optimization, so be sure not to set the value too low!  
**Search type** - How the searching is handled. 
- "By Attribute(s)" uses the Mendix [ListValue API](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-client-apis-list-values/) to do optimal server-side filtering.
- "By Data Source Microflow" allows you to get the user's search text as an attribute on the page and then use that attribute inside the data source Microflow to filter the options however you want.

**Search Text** - String attribute that holds the text the user entered. With this example, it should be the SearchText attribute on the SearchHelper entity.  
**Has More Results** - Boolean expression to show the More Results Text. If you want to limit the results, set as $SearchHelper/hasMoreResults. If you do not want to limit the results, simply set the expression as false.  
**On Click More Results** - MxAction called when the user clicks on the more results text. *This is only needed if you want to limit the results list*. Should be a Nanoflow similar to the one below that increments the page size by the original page size and then runs the refresh object action from [Nanoflow Commons](https://marketplace.mendix.com/link/component/109515).  
![onClickShowMore](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/onClickShowMore.png)  
*Note: If you're limiting the result list, I would recommend setting the On Leave action from the Events tab to use a Nanoflow that resets the pageSize back to the original value. This prevents the widget from retrieving too many results if the widget is not in use.* 
