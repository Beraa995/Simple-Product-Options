<?php
/**
 * @category  Bunited
 * @package   Bunited\SimpleOptions
 * @author    Berin Kozlic - beringgmu@gmail.com
 * @copyright 2018 Berin Kozlic
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

namespace Bunited\SimpleOptions\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Eav\Setup\EavSetup;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface;

/**
 * Class InstallData
 */
class InstallData implements InstallDataInterface
{

    /**
     * @var EavSetupFactory
     */
    private $eavSetupFactory;

    /**
     * Constructor
     *
     * @param \Magento\Eav\Setup\EavSetupFactory $eavSetupFactory
     */
    public function __construct(EavSetupFactory $eavSetupFactory)
    {
        $this->eavSetupFactory = $eavSetupFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function install(
        ModuleDataSetupInterface $setup,
        ModuleContextInterface $context
    ) {
        $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);

        $eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'simple_product_field',
            [
                'type'          => 'varchar',
                'label'         => 'Simple Product',
                'input'         => 'text',
                'global'        => ScopedAttributeInterface::SCOPE_GLOBAL,
                'visible'       => false,
                'required'      => false,
                'user_defined'  => true,
                'default'       => null,
                'group'         => 'General',
                'apply_to'      => 'configurable',
            ]
        );
    }
}
