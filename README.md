# REST-and-jQuery
Reading data in from a REST api and parsing the data using jquery

There is a REST endpoint that holds data about people (name and location). The endpoint needs a page number and a number of entries per page to show, if no number of entries is given the page will default to 10. The page may or may not have data. Different data may be available depending on number of enteries per page given (for example 4/5 will return entries 16-20, while 4/6 will return 19-24), some pages will not have any data at all.

 
