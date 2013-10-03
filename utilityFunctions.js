var pathElements = [];
var dirResults = {};

var displayError = function (error) {
  Modal.error({
    title: "Error",
    message: error
  });
}

var displayDropboxError = function (error) {
  switch (error.status) {
  case Dropbox.ApiError.INVALID_TOKEN:
    // If you're using dropbox.js, the only cause behind this error is that
    // the user token expired.
    // Get the user through the authentication flow again.

    // Rajat : currently requesting user to refresh.
    displayError("Looks like you token expired. Please refresh.");
    break;

  case Dropbox.ApiError.NOT_FOUND:
    // The file or folder you tried to access is not in the user's Dropbox.
    // Handling this error is specific to your application.
    displayError("Looks like the file/folder you are trying to access is not available.");
    break;

  case Dropbox.ApiError.OVER_QUOTA:
    // The user is over their Dropbox quota.
    // Tell them their Dropbox is full. Refreshing the page won't help.
    displayError("Your Dropbox is full. Clear some space and try again.");
    break;

  case Dropbox.ApiError.RATE_LIMITED:
    // Too many API requests. Tell the user to try again later.
    // Long-term, optimize your code to use fewer API calls.
    displayError("Please try again later.");
    break;

  case Dropbox.ApiError.NETWORK_ERROR:
    // An error occurred at the XMLHttpRequest layer.
    // Most likely, the user's network connection is down.
    // API calls will not succeed until the user gets back online.
    displayError("Ensure that you are connected to the Internet and try again!");
    break;

  case Dropbox.ApiError.INVALID_PARAM:
  case Dropbox.ApiError.OAUTH_ERROR:
  case Dropbox.ApiError.INVALID_METHOD:
  default:
    // Caused by a bug in dropbox.js, in your application, or in Dropbox.
    // Tell the user an error occurred, ask them to refresh the page.
    displayError("Some bug seems to have caused a problem. Please refresh the page and try again.");
  }
};

var pathString = function () {
  return "/" + pathElements.join("/");
}

var listDir = function (client, path, func) {
  var operateOnList = function (files, func) {
    for (var i = 0; i < files.length; i++) {
      func(client, files[i]);
    }
  }

  console.log(dirResults);
  if (dirResults[path] !== undefined) {
    operateOnList(dirResults[path], func);
    doneLoading();
  }
  else {
    client.readdir(path, function (error, results, dirStat, contentStats) {
      // Check for error.
      for (var i = 0; i < results.length;  i++) {
        contentStats[i].name = results[i];
      }
      dirResults[path] = contentStats;
      operateOnList(contentStats, func);
      doneLoading();
    });
  }
}



var inLoadingState = function () {
  $('#loadingInfo').show();
}

var doneLoading = function () {
  $('#loadingInfo').hide();
}

var addRowToFileBrowser = function (elements) {
  var row = document.createElement("tr");
  row.innerHTML = "";
  for (var i = 0; i < elements.length; i++) {
    row.innerHTML += "<td>" + elements[i] + "</td>";
  }
  $("#file_browser").append(row);
}

var listDirInHTML = function (client, path) {
  $("#file_browser").children().remove();
  inLoadingState();
  listDir(client, path, addFileDetailsToTable);
}

var addPathElement = function (subDirectory, client) {
  li = $(document.createElement("li"));
  li.html(subDirectory + "<span class='divider'>/</span>");
  pathElements.push(subDirectory);
  finalPath = pathString();
  li.attr("path", finalPath);
  li.attr("class", "breadcrumbEntry");
  $('#navigation').append(li);
  $('#parentDirectory').show();
  $('#parentDirectory').unbind('click');
  $('#parentDirectory').click(function () {
    removePathElement(client);
  });
}

var addFileDetailsToTable = function (client, file) {
  if (file.isRemoved)
    return;

  var row = $(document.createElement("tr"));
  var nameElement = $(document.createElement("td"));
  var typeElement = $(document.createElement("td"));
  var dateElement = $(document.createElement("td"));

  nameElement.html("<a href='#'>" + file.name + "</a>");
  typeElement.text(file.mimeType);
  dateElement.text(" " + file.modifiedAt);

  if (file.isFolder) {
    nameElement.click(function () {
      folderClicked(client, file.path);
    });
  }
  else {
    nameElement.click(function () {
      fileClicked(client, file.path);
    });
  }
  row.append(nameElement);
  row.append(typeElement);
  row.append(dateElement);
  $("#file_browser").append(row);
}

var folderClicked = function (client, path) {
  console.log("folder clicked");
  addPathElement(path.split("/").pop(), client);
  listDirInHTML(client, path);
}

var getFileNameFromPath = function(path){
  var partsOfPath = path.split("/");
  return partsOfPath[partsOfPath.length - 1];
}

var fileClicked = function (client, path) {
  password = window.prompt("Enter password");
  
  client.readFile(path, function (error, result) {
    if (error !== null){
      displayError(error);
    }

    var decryptedText = sjcl.decrypt(password, result);

    // Handle errors here
    setEditorValues(getFileNameFromPath(path), decryptedText);
    showEditor();
  });
}

var hideEditor = function(){
  $('.zen-editor').hide(); 
  $('.container-fluid').show();
}
var showEditor = function(){
  $('.zen-editor').show();
  $('.container-fluid').hide();

}

var removePathElement = function (client) {
  var nav = $('#navigation');
  console.log("Entered");
  if (nav.children().length > 1) {
    nav.children().last().remove(); // This changes the length
  }

  if (nav.children().length === 2) {
    $('#parentDirectory').hide();
  }
  pathElements.pop();
  console.log(pathString());
  listDirInHTML(client, pathString());
}

var createDirectory = function (client, parentDir, dirName) {
  client.mkdir(parentDir + "/" + dirName, function (error, result) {
    if (error) {
      displayError($.parseJSON(error.responseText).error);
    }
    else {
      // Clear the result already stored.
      delete dirResults[parentDir];
      listDirInHTML(client, parentDir);
    }
  });
}

var createFile = function (client, path, fileName, content, key) {
  var encryptedContent = sjcl.encrypt(key, content);
  console.log(client, path, fileName, content, key);
  client.writeFile(path + "/" + fileName, encryptedContent, function (error, result) {
    if (error) {
      displayDropboxError(error);
    }
    else {
      Modal.info({
        title: "File saved",
        message: "'" + fileName + "' has been saved. Please remember your password: " + key
      });
    }
  });
}

var getEditorTitleEntity = function(){
  return $('#newFileName');
}

var getEditorContentEntity = function(){
  return $('#fileContent');
}

var setEditorValues = function(title, content){
  var titleEntity = getEditorTitleEntity();
  var contentEntity = getEditorContentEntity();

  titleEntity.text(title);
  contentEntity.html(content);
}


var resetEditor = function(){
  setEditorValues("Name of the file", "Content of the file");
  $('#key').val("");
  $('#verify_key').val("");
}
