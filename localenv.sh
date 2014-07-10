#!/bin/sh

set -e

case "$1" in
        init)
                vagrant plugin install vagrant-vbguest
                vagrant up
                vagrant reload
                ;;
esac
