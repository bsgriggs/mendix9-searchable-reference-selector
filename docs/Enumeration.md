# Enumeration Selector

The following documentation is for using Selection Type "Enumeration" with Automatic filtering under the Data Source
tab. If you need another selection type, see the documentation at these links:

-   [Enumeration Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Enumeration.md)
-   [Boolean Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Boolean.md)
-   [Reference Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/Reference.md)
-   [Reference Set Selector](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ReferenceSet.md)

Check [here](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/master/docs/ManualFiltering.md) for
more information on using manual filtering. Many of the options are removed with the expectation you will be adding the
features manually in your microflow data source.

## General Settings

![generalEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/generalEnum.png)

### Label

**Label** - Mendix label, displayed either horizontally or vertically to the input based on your parent data view's
settings.  
**Placeholder** - The text that is shown while no options are selected.

### Data source

**Selection type** - The attribute or association type that the widget is expected to set.  
**Enum attribute** - The attribute that will be set when the user selects an option. The widget automatically displays
all possible options for the selected enumeration.  
**Enum filter type** - Allows you to customize which enumeration values are selectable

-   Off = All options are selectable
-   Include = Only the specified values are selectable
-   Exclude = The specified values are not selectable

**Enum filter list** - A comma-separated list of the enumeration's keys. They are used according to the Enum Filter
Type. The list should not have any spaces.

**Enum filter example**  
Imagine you had an enumeration with the possible values Red, Orange, Yellow, Green, Blue, and Violet in the following
scenarios:

-   The user cannot select Violet = Enum Filter Type "Exclude" & Enum Filter List "Violet"
-   The user cannot select Green or Blue = Enum Filter Type "Exclude" & Enum Filter List "Green,Blue"
-   The user can only select Red or Yellow = Enum Filter Type "Include" & Enum Filter List "Red,Yellow"
-   The user can only select Green, Blue or Violet = Enum Filter Type "Include" & Enum Filter List "Green,Blue,Violet"

### Searching

**Searchable?** - Whether or not the user can search for an enumeration value **Search delay** - The number of
milliseconds between the user's last typing and applying the search criteria. This is an important performance
optimization, so be sure not to set the value too low!  
**Search function** - How the user's text is used to filter the results list. Contains mode will return any options
where an exact match is found at any point in the option's text. Starts With mode will return options that have an exact
match at the beginning of the option's text.

_Starts With can help with performance but it can be bad UX depending on the use case. For example, displaying a list of
user full names would not work, because the user may enter the last name instead of the first name._

## Style Settings

![generalEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/styleEnum.png)  
**Select style** - Determines if the options menu displays as a dropdown on-click or is always shown as a list on the
page.  
**Option style** - Determines the style of the selected options. Choose between radio buttons or cells with a grey
background color.  
| Cell | Radio Buttons |  
| ------------- | ------------- |  
| ![DropdownRef](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/demoDrop.png) |
![ListRef](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/demoList.png) |

**Max menu height** - A string expression for CSS height for the dropdown. Defaults to 15em.  
**Dropdown icon** - Override the default dropdown icon with your own glyphicon or images.

## Customization Settings

![customizationEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/customizationEnum.png)

### Text

**No Results Text** - Text displayed if there are no results. (i.e. either the data source returned nothing or the user
enters a search text and nothing is found)

### Clearing

**Clearable?** - Allows the user to set the value as empty.  
**Clear icon text** - Tooltip text for the clear icon and what is read by the screen reader on focus.  
**Clear icon** - Override the default clear icon with your own glyphicon or images.

## Events Settings

![eventsNotRefSet](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/eventsNotRefSet.png)  
**On Change** - Perform an MxAction when the user selects an option different from the current value.  
**On Enter** - Perform an MxAction when the user focuses the search input.  
**On Leave** - Perform an MxAction when the user clicks or tabs away from the input.

## Accessibility Settings

![accessibilityBool&Enum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/accessibilityBool&Enum.png)  
**Aria label** - Text read by the screen reader when first focusing on the input. Should describe what the field is and
can be used to read the current value.

## Common Settings

![styleEnum](https://github.com/bsgriggs/mendix9-searchable-reference-selector/blob/media/v4/common.png)  
**Name** - Mendix name for the widget.  
**Tab index** - The tab order of the widget. This should be left at 0 for most situations.  
**Visible** - Boolean expression that determines if the widget is rendered at all.  
**Editable** - Boolean expression that determines if the user is allowed to select a value.
