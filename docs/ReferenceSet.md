### Reference Set Selector
The following documentation is for using Selection Type "Reference Set" with Automatic filtering under the Data Source tab. If you need another selection type, see the documentation at these links:
-   [Enumeration Selector](docs/Enumeration.md)
-   [Reference Selector](docs/Reference.md)
-   [Reference Set Selector](docs/ReferenceSet.md)

Check [here](docs/ManualFiltering.md) if you are using manual filtering. Many of the options are removed with the expectation you will be adding the features manually in you microflow data source.

#### Customization Settings  
![customizationSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/customizationSet.png)  
**Searchable?** - Allow the user to filter the results by entering a search string. When disabled, the text box is read only. Disabling searchability can be useful when using Select Style "List on Page" and you have a limited set of results. The user would then see a simple list on the page of available options.  
**Clearable?** - Allow the user to remove all selections / set the association as empty. You could disable this setting if you want the user to *always* have at least 1 selection.  
**Show Select All?** - Display a button to allow the user to select all the records currently shown to the user. This does **not** select records outside the maximum. For example, if you have Max Items set to 50 and the user clicks Select All -> only the first 50 records will be set on the reference set.  
**Max Items** - Integer expression for the limit of records to display at once. **Very important setting if you encounter performance issues**. If the value is set to 0, then no limit will be applied.  
**More Results Text** - Text displayed at the end of the results list if there are more results than the Max Items. This text is to inform the user that they need to enter search criteria to view more records. *If Max Items is set to 0, then this setting is not available because all records are always shown.*  
**No Results Text** - Text displayed if there are not results. (i.e. either the data source returned nothing or the user enters a search text and nothing is found)  

#### Styling Settings  
![styleSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v2/styleSet.png)  


#### Data Source Settings

### Filtering Settings

#### When using reference sets, make sure that the page object is the owner of the association!!!  
In the example below, imagine your page has a QuestionConfig object and you want to select its OptionConfigs. You must use the QuestionConfig_OptionConfig association. If your page object is OptionConfig and you need to set its QuestionConfigs, use the OptionConfig_QuestionConfig association.  

![Data Source](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/referenceSetOwner.png)  

*Note: the owner of an association is denoted by which side(s) of the line has the black circle. In the real world, you should only have 1 of these associations. Either decide which object should be the owner or set the association as "refer to each other"*
