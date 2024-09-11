<?php

namespace Scandiweb\Internals;

class ConfigurationManager {
    private array $config;
    public function __construct() {
        // Initializing the configurations

        $config_file = fopen(__DIR__ . "/../Resources/config.json", "r") or die("Couldn't open the configuration file");
        $config_json = fread($config_file, filesize(__DIR__ . "/../Resources/config.json"));
        $this->config = json_decode($config_json, true);
    }


    public function getConfig(): array{
        return $this->config;
    }

}