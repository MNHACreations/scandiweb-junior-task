<?php

namespace Scandiweb\Internals;

// TODO: We will not be accepting direct HTTP from our clients starting with scandiweb 3.2 - Lead (MNHACreations)
// TODO: Please email me with your assigned object using our new communication socket.
use Scandiweb\Objects\Socket;

class SecuredSocket
{
    public function getOverHTTP(): Socket {

         $original_URL = $_SERVER["REQUEST_URI"];



        // Resulting in an internal overloop
        return new Socket(new Socket());
    }
}