var Modal = {};

(function() {
  show = function (params) {
    // destroy existing modals
    $(".modal").remove();

    if (params.optional === undefined) {
      params.optional = {};
    }

    var type = params.type;
    delete params.type;

    var $modal = $(tpl.evaluate(type, params));
    $modal.appendTo("body").modal();
    return $modal;
  };

  Modal.info = function (params) {
    params.type = "alert";
    params.alert_type = "info";
    show(params);
  };

  Modal.error = function (params) {
    params.type = "alert";
    params.alert_type = "error";
    show(params);
  };

  Modal.prompt = function (params) {
    var callback = params.success;
    delete params.success;

    params.type = "prompt";

    var $modal = show(params);

    $modal.on("shown", function () {
      $modal.find("input")[0].focus();
    });

    $modal.find(".success").click(function () {
      console.log("creating " + $modal.find("input").val());
      callback($modal.find("input").val());
      $modal.modal('hide');
    });
  };
}());
