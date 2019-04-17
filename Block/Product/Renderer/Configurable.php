<?php
/**
 * @category  Bunited
 * @package   Bunited\SimpleOptions
 * @author    Berin Kozlic - beringgmu@gmail.com
 * @copyright 2019 Berin Kozlic
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

namespace Bunited\SimpleOptions\Block\Product\Renderer;

use Bunited\SimpleOptions\Helper\Data as SimpleData;
use Magento\Catalog\Block\Product\Context;
use Magento\Catalog\Helper\Product as CatalogProduct;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\ProductRepository;
use Magento\ConfigurableProduct\Helper\Data;
use Magento\ConfigurableProduct\Model\ConfigurableAttributeData;
use Magento\Customer\Helper\Session\CurrentCustomer;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Json\EncoderInterface;
use Magento\Framework\Json\Helper\Data as JsonData;
use Magento\Framework\Pricing\PriceCurrencyInterface;
use Magento\Framework\Stdlib\ArrayUtils;
use Magento\Swatches\Block\Product\Renderer\Configurable as ConfigurableProduct;
use Magento\Swatches\Helper\Data as SwatchData;
use Magento\Swatches\Helper\Media;

/**
 * Class Configurable
 * @package Bunited\SimpleOptions\Block\Product\Renderer
 */
class Configurable extends ConfigurableProduct
{
    /**
     * Path to Bunited template file with Swatch renderer.
     */
    const BUNITED_SWATCH_RENDERER_TEMPLATE = 'Bunited_SimpleOptions::product/view/swatch-renderer.phtml';

    /**
     * Path to default template file with standard Configurable renderer.
     */
    const CONFIGURABLE_RENDERER_TEMPLATE = 'Bunited_SimpleOptions::product/view/configurable-renderer.phtml';

    /**
     * Simple Options Helper
     *
     * @var Data
     */
    protected $simpleData;

    /**
     * Product repository
     *
     * @var ProductRepository
     */
    protected $productRepository;

    /**
     * Json helper
     *
     * @var JsonData
     */
    protected $jsonHelper;

    /**
     * @param Context $context
     * @param ArrayUtils $arrayUtils
     * @param EncoderInterface $jsonEncoder
     * @param Data $helper
     * @param CatalogProduct $catalogProduct
     * @param CurrentCustomer $currentCustomer
     * @param PriceCurrencyInterface $priceCurrency
     * @param ConfigurableAttributeData $configurableAttributeData
     * @param SwatchData $swatchHelper
     * @param Media $swatchMediaHelper
     * @param array $data other data
     * @param SimpleData $simpleData
     * @param ProductRepository $productRepository
     * @param JsonData $jsonHelper
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        Context $context,
        ArrayUtils $arrayUtils,
        EncoderInterface $jsonEncoder,
        Data $helper,
        CatalogProduct $catalogProduct,
        CurrentCustomer $currentCustomer,
        PriceCurrencyInterface $priceCurrency,
        ConfigurableAttributeData $configurableAttributeData,
        SwatchData $swatchHelper,
        Media $swatchMediaHelper,
        SimpleData $simpleData,
        ProductRepository $productRepository,
        JsonData $jsonHelper,
        array $data = []
    ) {
        $this->simpleData = $simpleData;
        $this->productRepository = $productRepository;
        $this->jsonHelper = $jsonHelper;

        parent::__construct(
            $context,
            $arrayUtils,
            $jsonEncoder,
            $helper,
            $catalogProduct,
            $currentCustomer,
            $priceCurrency,
            $configurableAttributeData,
            $swatchHelper,
            $swatchMediaHelper,
            $data
        );
    }

    /**
     * Return Bunited renderer template
     *
     * @return string
     */
    protected function getRendererTemplate()
    {
        if ($this->simpleData->isEnabled()) {
            return $this->isProductHasSwatchAttribute() ?
                self::BUNITED_SWATCH_RENDERER_TEMPLATE : self::CONFIGURABLE_RENDERER_TEMPLATE;
        }

        return parent::getRendererTemplate();
    }

    /**
     * Return gallery switch strategy
     *
     * @return string
     */
    public function getGallerySwitchStrategy()
    {
        return $this->simpleData->getGallerySwitchStrategy();
    }

    /**
     * Composes simple product configuration for js
     *
     * @return string
     * @throws NoSuchEntityException
     */
    public function getJsonSimpleConfig()
    {
        $currentProduct = $this->getProduct();

        $config = [
            'simpleProduct' => $this->getSimpleProductId($currentProduct),
            'attributes' => $this->getSimpleUpdates()
        ];

        return $this->jsonEncoder->encode($config);
    }

    /**
     * Composes module configuration for js
     *
     * @return string
     * @throws NoSuchEntityException
     */
    public function getJsonModuleConfig()
    {
        $config = [
            'preselected' => $this->simpleData->getPreselected(),
            'updateSimple' => $this->getSimpleUpdates()
        ];

        return $this->jsonEncoder->encode($config);
    }

    /**
     * Return chosen simple product id
     *
     * @param Product $product
     *
     * @return boolean | int
     * @throws NoSuchEntityException
     */
    protected function getSimpleProductId($product)
    {
        if (!$product->hasData('simple_product_field') ||
            !$product->getData('simple_product_field')) {
            return false;
        }

        $productSimple = $this->productRepository->getById($product->getData('simple_product_field'));

        return $productSimple->getId();
    }

    /**
     * Return product simple values
     *
     * @return array
     * @throws NoSuchEntityException
     */
    protected function getSimpleUpdates()
    {
        $content = [];
        $data = $this->jsonHelper->jsonDecode($this->simpleData->getSimpleAttributes());

        foreach ($this->getAllowProducts() as $product) {
            $childProduct = $this->productRepository->getById($product->getId());
            $content[$product->getId()]['length'][] = count($data);

            foreach ($data as $value) {
                $content[$product->getId()]['identity'][] = $value['identity'];
                $content[$product->getId()]['value'][] = $childProduct->hasData($value['simpleattribute']) ? $childProduct->getData($value['simpleattribute']) : null;
            }
        }

        return $content;
    }
}
