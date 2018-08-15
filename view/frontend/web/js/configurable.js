/**
 * @category  Bunited
 * @package   Bunited\SimpleOptions
 * @author    Berin Kozlic - beringgmu@gmail.com
 * @copyright 2018 Berin Kozlic
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

define([
    'jquery',
    'jquery/ui',
    'Magento_ConfigurableProduct/js/configurable'
], function($){

    $.widget('bunited.simpleOptionsConfigurable', $.mage.configurable, {
        /**
         * Creates widget
         * @private
         */
        _create: function () {
            // Initial setting of various option values
            this._initializeOptions();

            // Override defaults with URL query parameters and/or inputs values
            this._overrideDefaults();

            // Change events to check select reloads
            this._setupChangeEvents();

            // Fill state
            this._fillState();

            // Setup child and prev/next settings
            this._setChildSettings();

            // Setup/configure values to inputs
            this._configureForValues();

            //Bunited options
            this._setPreSelectedOptions();

            $(this.element).trigger('configurable.initialized');
        },

        /**
         * Configure an option, initializing it's state and enabling related options, which
         * populates the related option's selection and resets child option selections.
         * @private
         * @param {*} element - The element associated with a configurable option.
         */
        _configureElement: function (element) {
            this.simpleProduct = this._getSimpleProductId(element);

            if (element.value) {
                this.options.state[element.config.id] = element.value;

                if (element.nextSetting) {
                    element.nextSetting.disabled = false;
                    this._fillSelect(element.nextSetting);
                    this._resetChildren(element.nextSetting);
                } else {
                    if (!!document.documentMode) { //eslint-disable-line
                        this.inputSimpleProduct.val(element.options[element.selectedIndex].config.allowedProducts[0]);
                    } else {
                        this.inputSimpleProduct.val(element.selectedOptions[0].config.allowedProducts[0]);
                    }
                }
            } else {
                this._resetChildren(element);
            }

            this._reloadPrice();
            this._displayRegularPriceBlock(this.simpleProduct);
            this._displayTierPriceBlock(this.simpleProduct);
            this._displayNormalPriceLabel();
            this._changeProductImage();
            this._updateSimpleProduct(element);
        },

        /**
         * Set preselected product swatches
         *
         * @private
         */
        _setPreSelectedOptions: function () {
            let $widget = this,
                moduleConfig = $widget.options.jsonModuleConfig,
                simpleProductId = $widget.options.jsonSimpleConfig.simpleProduct,
                simpleAttributes = $widget.options.spConfig.index[simpleProductId] ?
                    $widget.options.spConfig.index[simpleProductId] : false,
                gallery = $widget.element.parents('.column.main').find($widget.options.mediaGallerySelector);

            if (moduleConfig['preselected']) {
                gallery.data('gallery') ?
                    $widget._preselectOptions(simpleAttributes, $widget) :
                    gallery.on('gallery:loaded', function () {
                        $widget._preselectOptions(simpleAttributes, $widget);
                    });
            }
        },

        /**
         * Selecting options
         *
         * @private
         */
        _preselectOptions: function(selectedOptions, widget) {
            if (selectedOptions) {
                $.each(selectedOptions, function (index, value) {
                    let attributeId = index,
                        optionId = value,
                        $select = $(widget.options.superSelector + '[name="super_attribute[' + attributeId + ']"]'),
                        $optionElement = $select.find('option[value="' + optionId + '"]').first();

                    $select.val($optionElement.val());
                    $select.trigger('change');
                });
            } else {
                $(widget.options.superSelector).each(function () {
                    let $select = $(this),
                        $optionElement = $select.find('option:not([disabled])').first();

                    if (!$optionElement.val()) {
                        $optionElement = $optionElement.next('option:not([disabled])');
                    }

                    $select.val($optionElement.val());
                    $select.trigger('change');
                });
            }
        },

        /**
         * Update simple product options
         *
         * @private
         */
        _updateSimpleProduct: function (element) {
            let $widget = this,
                moduleConfig = $widget.options.jsonModuleConfig,
                options = _.object(_.keys($widget.optionsMap), {}),
                simpleConfig = $widget.options.jsonSimpleConfig,
                key,
                attributeId = element.config.id;

            options[attributeId] = element.value;

            if (moduleConfig['updateSimple']) {
                if (simpleConfig) {
                    key = _.findKey($widget.options.spConfig.index, options);

                    let content = simpleConfig.attributes[key];

                    if (content) {
                        for (let i = 0; i < content['length']; i++) {
                            if ($(content['identity'][i]).length && content['value'][i]) {
                                $(content['identity'][i]).html(content['value'][i]);
                            }
                        }
                    }
                }
            }
        },
    });

    return $.bunited.simpleOptionsConfigurable;
});