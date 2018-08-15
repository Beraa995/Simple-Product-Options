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
    'Magento_Swatches/js/swatch-renderer'
], function($){

    $.widget('bunited.simpleOptionsSwatch', $.mage.SwatchRenderer, {
        /**
         * @private
         */
        _init: function () {
            if (_.isEmpty(this.options.jsonConfig.images)) {
                this.options.useAjax = true;
                // creates debounced variant of _LoadProductMedia()
                // to use it in events handlers instead of _LoadProductMedia()
                this._debouncedLoadProductMedia = _.debounce(this._LoadProductMedia.bind(this), 500);
            }

            if (this.options.jsonConfig !== '' && this.options.jsonSwatchConfig !== '') {
                // store unsorted attributes
                this.options.jsonConfig.mappedAttributes = _.clone(this.options.jsonConfig.attributes);
                this._sortAttributes();
                this._RenderControls();
                this._setPreSelectedGallery();

                //Bunited options
                this._setPreSelectedSwatch();

                $(this.element).trigger('swatch.initialized');
            } else {
                console.log('SwatchRenderer: No input data received');
            }

            this.options.tierPriceTemplate = $(this.options.tierPriceTemplateSelector).html();
        },

        /**
         * Event for swatch options
         *
         * @param {Object} $this
         * @param {Object} $widget
         * @param {String|undefined} eventName
         * @private
         */
        _OnClick: function ($this, $widget, eventName) {
            let $parent = $this.parents('.' + $widget.options.classes.attributeClass),
                $wrapper = $this.parents('.' + $widget.options.classes.attributeOptionsWrapper),
                $label = $parent.find('.' + $widget.options.classes.attributeSelectedOptionLabelClass),
                attributeId = $parent.attr('attribute-id'),
                $input = $parent.find('.' + $widget.options.classes.attributeInput);

            if ($widget.inProductList) {
                $input = $widget.productForm.find(
                    '.' + $widget.options.classes.attributeInput + '[name="super_attribute[' + attributeId + ']"]'
                );
            }

            if ($this.hasClass('disabled')) {
                return;
            }

            if ($this.hasClass('selected')) {
                $parent.removeAttr('option-selected').find('.selected').removeClass('selected');
                $input.val('');
                $label.text('');
                $this.attr('aria-checked', false);
            } else {
                $parent.attr('option-selected', $this.attr('option-id')).find('.selected').removeClass('selected');
                $label.text($this.attr('option-label'));
                $input.val($this.attr('option-id'));
                $input.attr('data-attr-name', this._getAttributeCodeById(attributeId));
                $this.addClass('selected');
                $widget._toggleCheckedAttributes($this, $wrapper);
            }

            $widget._Rebuild();

            if ($widget.element.parents($widget.options.selectorProduct)
                .find(this.options.selectorProductPrice).is(':data(mage-priceBox)')
            ) {
                $widget._UpdatePrice();
            }

            $widget._loadMedia(eventName);
            $widget._updateSimpleProduct();
            $input.trigger('change');
        },

        /**
         * Event for select
         *
         * @param {Object} $this
         * @param {Object} $widget
         * @private
         */
        _OnChange: function ($this, $widget) {
            let $parent = $this.parents('.' + $widget.options.classes.attributeClass),
                attributeId = $parent.attr('attribute-id'),
                $input = $parent.find('.' + $widget.options.classes.attributeInput);

            if ($widget.productForm.length > 0) {
                $input = $widget.productForm.find(
                    '.' + $widget.options.classes.attributeInput + '[name="super_attribute[' + attributeId + ']"]'
                );
            }

            if ($this.val() > 0) {
                $parent.attr('option-selected', $this.val());
                $input.val($this.val());
            } else {
                $parent.removeAttr('option-selected');
                $input.val('');
            }

            $widget._Rebuild();
            $widget._UpdatePrice();
            $widget._loadMedia();
            $widget._updateSimpleProduct();
            $input.trigger('change');
        },

        /**
         * Set preselected product swatches
         *
         * @private
         */
        _setPreSelectedSwatch: function () {
            let $widget = this,
                classes = this.options.classes,
                moduleConfig = $widget.options.jsonModuleConfig,
                simpleProductId = $widget.options.jsonSimpleConfig.simpleProduct,
                simpleAttributes = $widget.options.jsonConfig.index[simpleProductId] ?
                    $widget.options.jsonConfig.index[simpleProductId] : false,
                gallery = $widget.element.parents('.column.main').find($widget.options.mediaGallerySelector);

            if (moduleConfig['preselected']) {
                gallery.data('gallery') ?
                    $widget._preselectOptions(simpleAttributes, $widget, classes) :
                    gallery.on('gallery:loaded', function () {
                        $widget._preselectOptions(simpleAttributes, $widget, classes);
                    });
            }
        },

        /**
         * Selecting swatches
         *
         * @private
         */
        _preselectOptions: function(selectedOptions, widget, classes) {
            if (selectedOptions) {
                $.each(selectedOptions, function (index, value) {
                    let attributeId = index,
                        optionId = value,
                        $wrapper = $('.' + classes.attributeClass + '[attribute-id="' + attributeId + '"]'),
                        $optionsWrapper = $wrapper.find('.' + classes.attributeOptionsWrapper);

                    if ($optionsWrapper.children().is('div')) {
                        let $optionElement = $wrapper.find('.' + classes.optionClass + '[option-id="' + optionId + '"]'),
                            $label = $wrapper.find('.' + classes.attributeSelectedOptionLabelClass),
                            $input = $wrapper.find('.' + classes.attributeInput);

                        $optionElement.addClass('selected');
                        $wrapper.attr('option-selected', optionId);
                        $label.text($optionElement.attr('option-label'));
                        $input.attr('data-attr-name', widget._getAttributeCodeById($wrapper.attr('attribute-id')));
                        $input.attr('value', $optionElement.attr('option-id'));
                    } else {
                        let $select = $optionsWrapper.find('select'),
                            $optionElement = $optionsWrapper.find('select option[option-id="' + optionId + '"]'),
                            $input = $wrapper.find('.' + classes.attributeInput);

                        $wrapper.attr('option-selected', optionId);
                        $input.val($optionElement.val());
                        $select.val($optionElement.val());
                    }
                });
            } else {
                $('.' + classes.attributeClass).each(function () {
                    let $wrapper = $(this),
                        $optionsWrapper = $wrapper.find('.' + classes.attributeOptionsWrapper);

                    if ($optionsWrapper.children().is('div')) {
                        let $optionElement = $wrapper.find('.' + classes.optionClass + ':not([disabled])').first(),
                            $label = $wrapper.find('.' + classes.attributeSelectedOptionLabelClass),
                            $input = $wrapper.find('.' + classes.attributeInput);

                        $optionElement.addClass('selected');
                        $wrapper.attr('option-selected', $optionElement.attr('option-id'));
                        $label.text($optionElement.attr('option-label'));
                        $input.attr('data-attr-name', widget._getAttributeCodeById($wrapper.attr('attribute-id')));
                        $input.attr('value', $optionElement.attr('option-id'));
                    } else {
                        let $select = $optionsWrapper.find('select'),
                            $optionElement = $optionsWrapper.find('select option:not([disabled])').first(),
                            $option = $optionElement.val() > 0 ? $optionElement : $optionElement.next('option:not([disabled])'),
                            $input = $wrapper.find('.' + classes.attributeInput);

                        $wrapper.attr('option-selected', $option.attr('option-id'));
                        $input.val($option.val());
                        $select.val($option.val());
                    }
                });
            }


            widget._Rebuild();

            if (widget.element.parents(widget.options.selectorProduct)
                .find(widget.options.selectorProductPrice).is(':data(mage-priceBox)')
            ) {
                widget._UpdatePrice();
            }

            widget._loadMedia();
            widget._updateSimpleProduct();
        },

        /**
         * Update simple product options
         *
         * @private
         */
        _updateSimpleProduct: function () {
            let $widget = this,
                moduleConfig = $widget.options.jsonModuleConfig,
                options = _.object(_.keys($widget.optionsMap), {}),
                simpleConfig = $widget.options.jsonSimpleConfig,
                key;

            $widget.element.find('.' + $widget.options.classes.attributeClass + '[option-selected]').each(function () {
                let attributeId = $(this).attr('attribute-id');

                options[attributeId] = $(this).attr('option-selected');
            });

            if (moduleConfig['updateSimple']) {
                if (simpleConfig) {
                    key = _.findKey($widget.options.jsonConfig.index, options);

                    let content = simpleConfig.attributes[key];

                    for (let i = 0; i < content['length']; i++) {
                        if ($(content['identity'][i]).length && content['value'][i]) {
                            $(content['identity'][i]).html(content['value'][i]);
                        }
                    }
                }
            }
        }
    });

    return $.bunited.simpleOptionsSwatch;
});