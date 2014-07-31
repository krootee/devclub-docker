# -*- mode: ruby -*-
# vi: set ft=ruby :

BOX_NAME = ENV['BOX_NAME'] || "ubuntu-14.04-64bit"
BOX_URI = ENV['BOX_URI'] || "http://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

FORWARD_DOCKER_PORTS = ENV['FORWARD_DOCKER_PORTS']
SSH_PRIVKEY_PATH = ENV["SSH_PRIVKEY_PATH"]

# A script to upgrade
$script = <<SCRIPT

# Install Docker
sudo sh -c "wget -qO- https://get.docker.io/gpg | apt-key add -"
sudo sh -c "echo 'deb http://get.docker.io/ubuntu docker main' > /etc/apt/sources.list.d/docker.list"

sudo apt-get update -y -q

# Install help utilities
sudo apt-get install nmon htop git ncdu nasm -y
# Install Docker
sudo apt-get install lxc-docker -y

sudo usermod -a -G docker vagrant

# Install jq for CLI JSON parsing
cd /home/vagrant
wget http://stedolan.github.io/jq/download/source/jq-1.4.tar.gz
tar xzf jq-1.4.tar.gz
cd jq-1.4
./configure
make
sudo make install
rm /home/vagrant/jq-1.4.tar.gz
rm -r /home/vagrant/jq-1.4
jq --version

# Install node.js
sudo apt-get install software-properties-common -y
sudo add-apt-repository ppa:chris-lea/node.js -y
sudo apt-get update -q
sudo apt-get install nodejs -y

# Install docker-enter
docker run --rm -v /usr/local/bin:/target jpetazzo/nsenter

SCRIPT

$vbox_script = <<VBOX_SCRIPT + $script
VBOX_SCRIPT

Vagrant::Config.run do |config|
  # Setup virtual machine box. This VM configuration code is always executed.
  config.vm.box = BOX_NAME
  config.vm.box_url = BOX_URI

  # Use the specified private key path if it is specified and not empty.
  if SSH_PRIVKEY_PATH
      config.ssh.private_key_path = SSH_PRIVKEY_PATH
  end

  config.ssh.forward_agent = true

  # Node.js application
  config.vm.forward_port 6001, 6001

end


Vagrant::VERSION >= "1.1.0" and Vagrant.configure("2") do |config|
  config.vm.provider :virtualbox do |vb, override|
    override.vm.provision :shell, :inline => $vbox_script
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
    vb.customize ["modifyvm", :id, "--memory", "1024"]
  end
end

#if !FORWARD_DOCKER_PORTS.nil?
#  Vagrant::VERSION >= "1.1.0" and Vagrant.configure("2") do |config|
#    (49000..49900).each do |port|
#      config.vm.network :forwarded_port, :host => port, :guest => port
#    end
#  end
#end
