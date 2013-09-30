var pathElements = [];
var dirResults = {};

var displayError = function(error){
  $.msgBox({
    title: "Ooops",
    content: error,
    type: "error",
    buttons: [{ value: "Ok" }]
  });
}

var showError = function(error){
  // Function to deal with the errors
};

var pathString = function(){
  return "/" + pathElements.join("/");
}

var listDir = function(client, path, func){
  var operateOnList = function(files, func){
    for(var i = 0; i < files.length; i++){
      func(client, files[i]);
    }
  }

  if (dirResults[path] != null){
    operateOnList(dirResults[path], func);
    doneLoading();
  }
  else{
    client.readdir(path, function(error, results, dirStat, contentStats){
      // Check for error.
      for (var i = 0; i < results.length;  i++){
        contentStats[i].name = results[i];
      } 
      dirResults[path] = contentStats;
      operateOnList(contentStats, func);
      doneLoading();
    });
  }
}



var inLoadingState = function(){
  $('#loadingInfo').show();
}

var doneLoading = function(){
  $('#loadingInfo').hide();
}

var addRowToFileBrowser = function(elements){
  var row = document.createElement("tr");
  row.innerHTML = "";
  for(var i = 0; i < elements.length; i++){
    row.innerHTML += "<td>" + elements[i] + "</td>";
  }
  $("#file_browser").append(row);
}

var listDirInHTML = function(client, path){
  $("#file_browser").children().remove();
  addRowToFileBrowser(["<b>Name</b>", "<b>Type</b>", "<b>Modified Date</b>"])
  inLoadingState();
  listDir(client, path, addFileDetailsToTable);
}

var storeEntry = function(dropboxClient){
  var data = $("#text").val();
  var password = $("#passcode").val();
  var encryptedInfo = sjcl.encrypt(password, data);
  console.log(encryptedInfo);
  var decryptedData = sjcl.decrypt(password, encryptedInfo);
  console.log(decryptedData);
  var fileName = $('#title').val();
  dropboxClient.writeFile(fileName, encryptedInfo, function(error, stat){
    if (error){
      return showError(error);
    }

    console.log("File saved as revision " + stat.revisionTag);
    console.log(stat);
  });
}

var addPathElement = function(subDirectory, client){
  li = $(document.createElement("li"));
  li.html(subDirectory + "<span class='divider'>/</span>");
  pathElements.push(subDirectory);
  finalPath = pathString();
  li.attr("path", finalPath);
  li.attr("class", "breadcrumbEntry");
  $('#navigation').append(li);                 
  $('#parentDirectory').show();
  $('#parentDirectory').unbind('click');
  $('#parentDirectory').click(function(){
    removePathElement(client);
  });
}

var addFileDetailsToTable = function(client, file){
  if (file.isRemoved)
    return;

  var row = $(document.createElement("tr"));
  var nameElement = $(document.createElement("td"));
  var typeElement = $(document.createElement("td"));
  var dateElement = $(document.createElement("td"));

  nameElement.html("<a href='#'>" + file.name + "</a>");
  typeElement.text(file.mimeType);
  dateElement.text(" " + file.modifiedAt);

  if (file.isFolder){
    nameElement.click(function(){
      folderClicked(client, file.path);
    });
  }
  else{
    nameElement.click(function(){
      fileClicked(client, file.path);
    });
  }
  row.append(nameElement);
  row.append(typeElement);
  row.append(dateElement);
  $("#file_browser").append(row);
}

var folderClicked = function(client, path){
  console.log("folder clicked");
  addPathElement(path.split("/").pop(), client);
  listDirInHTML(client, path);
}

var fileClicked = function(client, path){
  password = window.prompt("Enter password");
  client.readFile(path, function(error, result){
    console.log(sjcl.decrypt(password, result));
  });
}
 
var removePathElement = function(client){
  var nav = $('#navigation');
  console.log("Entered");
  if (nav.children().length > 1){
    nav.children().last().remove(); // This changes the length
  }

  if (nav.children().length == 1){
    $('#parentDirectory').hide();
  }
  pathElements.pop();
  console.log(pathString());
  listDirInHTML(client, pathString());
}

var createDirectory = function(client, parentDir, dirName){
  client.mkdir(parentDir + "/" + dirName, function(error, result){
    if (error != null){
      // handle error;
    }
    else{
      // Clear the result already stored.
      dirResults[parentDir] = null;
      listDirInHTML(client, parentDir);
    }
  });
}

var createFile = function(client, path, fileName, content, key){
  var encryptedContent = sjcl.encrypt(key, content);
  client.writeFile(path + "/" + fileName, encryptedContent, function(error, result){
    console.log(result);
  });
}
