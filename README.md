# Magento 2 Bunited Configurable Product Simple Options

This module provides functionality to preselect simple options on configurable product page and update its attributes. <br />

## Installation

Install the latest version with

```
$ composer require bunited/simleoptions
```

Install module

```
$ php bin/magento setup:upgrade
$ php bin/magento setup:di:compile
```

Don't forget to clear cache
```
$ php bin/magento cache:flush
$ php bin/magento cache:clean
```

## Examples

#### Preselect options and update simple product attributes <br /><br />

![](https://media.giphy.com/media/VgCHCDbnMCWcTQDBXs/giphy.gif)

#### Admin system configuration <br />

Customize gallery switch strategy (replace/prepend) <br />
Enable/disable preselected options <br />
Enable/disable update attributes <br />
Add attributes to update as much as you want <br />

<img src="https://i.imgur.com/KkZuGmL.png" alt="system conf" width="1300px">

#### Choose specific simple product for preselect in admin

<img src="https://i.imgur.com/4d0V2ph.png" alt="product admin" width="1300px">

## Author

Berin Kozlić - <beringgmu@gmail.com><br />
You can hire me on [UPWORK](https://www.upwork.com/o/profiles/users/_~01b90298a30d9aeeb9/).
