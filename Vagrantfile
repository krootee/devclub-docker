# -*- mode: ruby -*-
# vi: set ft=ruby :

BOX_NAME = ENV['BOX_NAME'] || "ubuntu-14.04-64bit"
BOX_URI = ENV['BOX_URI'] || "http://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

FORWARD_DOCKER_PORTS = ENV['FORWARD_DOCKER_PORTS']
SSH_PRIVKEY_PATH = ENV["SSH_PRIVKEY_PATH"]

# A script to upgrade to install docker.
$script = <<SCRIPT
# Adding an apt gpg key is idempotent.
sudo sh -c "wget -qO- https://get.docker.io/gpg | apt-key add -"
sudo sh -c "echo 'deb http://get.docker.io/ubuntu docker main' > /etc/apt/sources.list.d/docker.list"

sudo apt-get update -y -q
# Install AUFS
sudo apt-get install linux-image-extra-`uname -r` -y
# Install help utilities
sudo apt-get install nmon htop git ncdu -y
# Install Docker
sudo apt-get install lxc-docker -y

sudo usermod -a -G docker vagrant

# By default, UFW drops all forwarding traffic. As a result will you need to enable UFW forwarding
sudo sed -i -e '/DEFAULT_FORWARD_POLICY=/ s+=.*+="ACCEPT"+' /etc/default/ufw
sudo ufw reload
# UFW's default set of rules denies all incoming traffic. If you want to be able to reach your containers from another host then you should allow incoming connections on the Docker port (default 4243)
sudo ufw allow 4243/tcp

# Install jq for CLI JSON parsing
wget http://stedolan.github.io/jq/download/source/jq-1.4.tar.gz
tar xzf jq-1.4.tar.gz
cd jq-1.4
./configure
make
sudo make install
rm /home/vagrant/jq-1.4.tar.gz
rm -r /home/vagrant/jq-1.3
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

  # Out stack
  #config.vm.forward_port 62111, 62111

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