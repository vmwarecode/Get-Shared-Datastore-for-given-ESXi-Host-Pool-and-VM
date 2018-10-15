// VMware vRealize Orchestrator action sample
//
// Get Shared Datastores for give host/pool/VM.
// 
// For vRO/VRA 7.0+
//
// Action Inputs:
// host - VC:HostSystem - Host System
// vm - VC:VirtualMachine - Virtual Machine
// pool - VC:ResourcePool - Resource Pool
// Selva Jaganathan VMware Inc.
// Return type: VC:Datastore - VC Datastore 
var compatibleDatastores = [];

// use OOTB function to find all datastores for the given host/pool/VM
var allDatastores = System.getModule("com.vmware.library.vc.datastore").getDatastoreForHostAndResourcePool(host,pool,vm);
var vmStorageNeeded = vm.summary.storage.committed;

System.debug("vm.summary.storage.committed (MB): " + (vmStorageNeeded / 1024 / 1024));

for each (var datastore in allDatastores) {
	datastore.refreshDatastore();
	
	System.debug("Checking compatibility of datastore: " + datastore.name);
	System.debug("  datastore.overallStatus: " + datastore.overallStatus);
	System.debug("  datastore.summary.accessible: " + datastore.summary.accessible);
	System.debug("  datastore.info.freeSpace (MB): " + (datastore.info.freeSpace / 1024 / 1024));
	
	if (datastore.summary.accessible
			&& datastore.summary.multipleHostAccess
			&& datastore.overallStatus != VcManagedEntityStatus.red
			&& datastore.overallStatus != VcManagedEntityStatus._red
			&& datastore.info.freeSpace >= vmStorageNeeded) {
		compatibleDatastores.push(datastore);
	}
}
var sharedDatastore = compatibleDatastores[Math.floor(Math.random() * compatibleDatastores.length)];
return sharedDatastore;