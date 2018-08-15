<?php
/**
 * @category  Bunited
 * @package   Bunited\SimpleOptions
 * @author    Berin Kozlic - beringgmu@gmail.com
 * @copyright 2018 Berin Kozlic
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

namespace Bunited\SimpleOptions\Block\Adminhtml\Form\Field;

use Magento\Config\Block\System\Config\Form\Field\FieldArray\AbstractFieldArray;

class Attributes extends AbstractFieldArray
{
    /**
     * {@inheritdoc}
     */
    protected function _prepareToRender()
    {
        $this->addColumn('identity', ['label' => __('Element Class or ID'), 'class' => 'required-entry']);
        $this->addColumn('simpleattribute', ['label' => __('Product Attribute'), 'class' => 'required-entry']);
        $this->_addAfter = false;
        $this->_addButtonLabel = __('Add');
    }
}