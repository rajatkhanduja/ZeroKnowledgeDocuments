var client = new Dropbox.Client({key:'75g7txpckgllo8y'});
client.authDriver(new Dropbox.AuthDriver.Redirect({rememberUser : false}));
if (!client.isAuthenticated()){
  client.authenticate(function(error, client){
    if(error){
      console.log(error);
    }
    console.log(client);
  });
}
$("#submitButton").click(function(){
  storeEntry(client);
});

listDirInHTML(client, "/");
$('#parentDirectory').hide();
$('#newDir').click(function(){
  createDirectory(client, pathString(), $('#newDirName').val());
});
$('#createFile').click(function(){
  createFile(client, pathString(), $('#newFileName').val(), $('#fileContent').val(), $('#key').val());
});

$('#reloadDir').click(function(){
  console.log("Reloading...");
  dirResults[pathString()] = null;
  listDirInHTML(client, pathString());
});
