<?php

namespace Sulu\Bundle\SearchBundle\Search;

use Massive\Bundle\SearchBundle\Search\Factory as BaseFactory;

class Factory extends BaseFactory
{
    public function makeDocument()
    {
        return new Document();
    }
}
