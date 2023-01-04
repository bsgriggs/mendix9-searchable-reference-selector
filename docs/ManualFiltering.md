### Manual Filtering
The following documentation is for using Selection Type "Reference Set" or "Reference" with Manual filtering. This will show you how to set up a limited results list for optimized performance and how to search on multiple attributes.  

If you need another selection type, see the documentation at these links:
-   [Enumeration Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Enumeration.md)
-   [Reference Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Reference.md)
-   [Reference Set Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ReferenceSet.md)

### Domain Model
You will need to create a non-persistent entity with the following attributes:
![searchHelper](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/searchHelper.png)

For the example in this documentation, consider the following domain model. The page object will be a Project while the user will be searching / selecting a Employee objects across the association Project_Employee.

![domain](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/domain.png)  

### Page Setup  
You need to wrap your page with a data view that creates a SearchHelper object. If you're using Mendix 9.18 or above, this will be very simple because page parameters are now available anywhere on the page. If you are not using Mendix 9.18 or above, you will need your action buttons inside a container under your main page parameter (in this example, the Project data view) then use CSS to style the button row correctly.  

![filteringManualPage](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/filteringManualPage.png)  

*I'm using Option Text Type Custom to display both the Employee's Name and Employee's ID in the same line*

### Data Source  
When using Manual Filtering, your data source **MUST** be either a nanoflow or a microflow. Inside that flow, you should have logic similar to the following. 

![filteringManualDataSource](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/filteringManualDataSource.png)  

1. Check that the user has entered a search text with a decision split using trim($SearchHelper/SearchText) != ''.  
2. Add a retrieve on each path. If you want to have a limit on your search results, then have BOTH retrieves use Custom ranges with the settings below.  
3. On the retrieve down the path with a search text, add an xpath constraint. For this example, I want the user to be able to search for either an Employee's name or an Employee's ID. *(Note: using the contains function in xpath does NOT apply database indexes. If you encounter performance issues, consider using startsWith() instead.)*  
![manualRetrieve](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/manualRetrieve.png)  
*(The following steps are only if you want to limit the search results. If you do not want to limit the search results, skip to step 7)*  
4. On both paths, add another retrieve with the same xpath constrants as the retrieve before it. Make sure BOTH retrieves use range All.  
5. On both paths, add Aggregate List activities that perform a count on the list directly before them. *(Dev Tip: having an Aggregate List activity directly following a retrieve performs a database count instead of retrieving the results and counting the lenght of the array. You can read more [here](https://docs.mendix.com/refguide/aggregate-list/#5-optimizing-aggregate-activities).)*  
6. On both paths, add a change object activity that changes SearchHelper.hasMoreResults with the expression $Count > $SearchHelper/PageSize.  
7. Set the return value as the FIRST retrieved list of each path. Using the second retrieves will break the database optimization mentioned in #5.  

### Filtering Settings  
![filteringSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/filteringManual.png)  
**Filter Delay** - The number of milliseconds between the user's last typing and applying the search criteria. This is an important performance optimization, so be sure not to set the value too low!  
**Filter Type** - How the filtering is handled. Auto mode uses the Mendix [ListValue API](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-client-apis-list-values/) to optimize memory management. Manual mode will allow you to set the user's search text as an attribute on the page then use that attribute inside the data source microflow.   
**Search Text** - Attribute that holds the text the user entered. With this example, it should be the SearchText attribute on the SearchHelper entity.  
**Has More Results** - Boolean expression to show the More Results Text. If you want to limit the results, set as $SearchHelper/hasMoreResults. If you do not want to limit the results, simply set the expression as true.  
**On Click More Results** - Microflow or nanoflow calle when the user clicks on the more results text. *This is only needed if you want to limit the results list* .Should be a microflow similar to the one below that increments the page size by the original page size.  
![onClickShowMore](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/onClickShowMore.png)  
**Refresh Action** - Microflow or nanoflow that performs a refresh in client on the SearchHelper object. This is required so the widget can re-run the data source.  
![refresh](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/refresh.png)  


