<?php
/**
 * @category  Bunited
 * @package   Bunited\SimpleOptions
 * @author    Berin Kozlic - beringgmu@gmail.com
 * @copyright 2018 Berin Kozlic
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

namespace Bunited\SimpleOptions\Helper;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Store\Model\ScopeInterface;

/**
 * Simple Options Data Helper
 */
class Data extends AbstractHelper
{
    const XML_PATH_ENABLED = 'simple_tab_general/simple_general/enabled';
    const XML_PATH_GALLERY = 'simple_tab_general/simple_frontend/gallery_switch';
    const XML_PATH_PRESELECTED = 'simple_tab_general/simple_frontend/preselected_options';
    const XML_PATH_SIMPLE_UPDATE = 'simple_tab_general/simple_frontend/simple_details';
    const XML_PATH_ATTRIBUTES = 'simple_tab_general/simple_attributes/simple_updates';

    /**
     * Extension config
     *
     * @var ScopeConfigInterface
     */
    protected $config;

    /**
     * @param ScopeConfigInterface $config
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        ScopeConfigInterface $config
    ) {
        $this->config = $config;
    }

    /**
     * Check if extension is enabled
     *
     * @return boolean
     */
    public function isEnabled()
    {
        return $this->config->getValue(self::XML_PATH_ENABLED, ScopeInterface::SCOPE_STORE);
    }

    /**
     * Check if preselected options are enabled
     *
     * @return boolean
     */
    public function getPreselected()
    {
        return $this->config->getValue(self::XML_PATH_PRESELECTED, ScopeInterface::SCOPE_STORE);
    }

    /**
     * Check if update simple detail option is enabled
     *
     * @return boolean
     */
    public function getSimpleUpdate()
    {
        return $this->config->getValue(self::XML_PATH_SIMPLE_UPDATE, ScopeInterface::SCOPE_STORE);
    }

    /**
     * Get gallery switch strategy
     *
     * @return string
     */
    public function getGallerySwitchStrategy()
    {
        return $this->config->getValue(self::XML_PATH_GALLERY, ScopeInterface::SCOPE_STORE);
    }

    /**
     * Get attributes data
     *
     * @return string
     */
    public function getSimpleAttributes()
    {
        return $this->config->getValue(self::XML_PATH_ATTRIBUTES, ScopeInterface::SCOPE_STORE);
    }
}
