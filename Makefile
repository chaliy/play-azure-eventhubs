.PHONY: all

RESOURCE_GROUP?=play-azure-eventhubs

# Create Azure Resource Group to play in
group:
	az group create -n $(RESOURCE_GROUP) -l "West Europe"

# Provision changes
apply:
	az group deployment create \
		--resource-group $(RESOURCE_GROUP) \
		--template-file azuredeploy.json