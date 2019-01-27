var currentPlay = {
  timeLogin: new Date(),
  count: 0,
  amountCollected: 0,
  user: {
    name: "thuy",
    email: "thuytwandpro@gmail.com",
    amount: 80000
  }
};

$(document).ready(function() {
  // localStorage.clear();
  if (localStorage.getItem("currentPlay") == null) {
    localStorage.setItem("currentPlay", JSON.stringify(currentPlay));
  } else {
    var lastPlay = new Date(
      JSON.parse(localStorage.getItem("currentPlay"))["timeLogin"]
    );
    lastPlay.setHours(0, 0, 0, 0);
    var currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);
    if (lastPlay.getTime() !== currentDay.getTime()) {
      localStorage.setItem("currentPlay", JSON.stringify(currentPlay));
    }
  }

  var result = JSON.parse(localStorage.getItem("currentPlay"));
  if (result["amountCollected"] > 0) {
    $("#btn-withdraw").removeAttr("disabled");
  } else {
    $("#btn-withdraw").attr("disabled", "disabled");
  }
  $("#count").text(result["count"]);
  $("#amount-collected").text(
    result["amountCollected"].toLocaleString("it-IT", {
      style: "currency",
      currency: "VND"
    })
  );
  $("#user-amount").text(
    result["user"]["amount"].toLocaleString("it-IT", {
      style: "currency",
      currency: "VND"
    })
  );
});

$(".server-item .card").click(() => {
  $("#server").css("display", "none");
});

function getRandom(length) {
  // return Math.floor(Math.random() * 10 * Math.pow(10, length - 1));
  var str = "",
    ranStr = "0123456789";
  for (var i = 0; i < length; i++) {
    str += ranStr.charAt(Math.floor(Math.random() * ranStr.length));
  }

  return str;
}

var rank8 = [],
  rank7 = [],
  rank6 = [],
  rank5 = [],
  rank4 = [],
  rank3 = [],
  rank2 = [],
  rank1 = [],
  lotteryUser = 0,
  defLottery = "";

function getLotteryToday() {
  rank8[0] = getRandom(1);
  $("#rank-8").text(rank8[0]);

  rank7 = Array.from(new Array(7), () => getRandom(2));
  $("#rank-7").text(
    rank7
      .reduce((str, val) => {
        return str + " - " + val;
      }, 0)
      .replace("0 - ", "")
  );

  rank6 = Array.from(new Array(6), () => getRandom(3));
  $("#rank-6").text(
    rank6
      .reduce((str, val) => {
        return str + " - " + val;
      }, 0)
      .replace("0 - ", "")
  );

  rank5 = Array.from(new Array(2), () => getRandom(4));
  $("#rank-5").text(
    rank5
      .reduce((str, val) => {
        return str + " - " + val;
      }, 0)
      .replace("0 - ", "")
  );

  rank4 = Array.from(new Array(2), () => getRandom(4));
  $("#rank-4").text(
    rank4
      .reduce((str, val) => {
        return str + " - " + val;
      }, 0)
      .replace("0 - ", "")
  );

  rank3[0] = getRandom(5);
  $("#rank-3").text(rank3[0]);

  rank2 = Array.from(new Array(2), () => getRandom(5));
  $("#rank-2").text(
    rank2
      .reduce((str, val) => {
        return str + " - " + val;
      }, 0)
      .replace("0 - ", "")
  );

  rank1[0] = getRandom(6);
  $("#rank-1").text(rank1[0]);
}
getLotteryToday();

$("#btn-lottery-rand").click(() => {
  defLottery = "------";
  $("#lottery-user h1").text(defLottery);
  $("#btn-lottery-rand").html('<i class="fas fa-spinner fa-pulse"></i>');
  $("#result").text("");

  var current = JSON.parse(localStorage.getItem("currentPlay"));
  current["count"] += 1;
  $("#count").text(current["count"]);

  var index = -1,
    time;

  if (current["user"]["amount"] > 0) {
    current["user"]["amount"] -= 2000;
    $("#user-amount").text(
      current["user"]["amount"].toLocaleString("it-IT", {
        style: "currency",
        currency: "VND"
      })
    );
    time = setInterval(() => {
      index++;
      if (index < 6) {
        defLottery = defLottery.replace(defLottery.charAt(index), getRandom(1));
        $("#lottery-user h1").text(defLottery);
      } else {
        clearInterval(time);
        $("#result").text("Processing...");
        setTimeout(() => {
          $("#btn-lottery-rand").text("Get Number");
          $("#result").text(
            getResult().toLocaleString("it-IT", {
              style: "currency",
              currency: "VND"
            })
          );

          current["amountCollected"] += getResult();
          if (current["amountCollected"] > 0) {
            $("#btn-withdraw").removeAttr("disabled");
          } else {
            $("#btn-withdraw").attr("disabled", "disabled");
          }
          localStorage.setItem("currentPlay", JSON.stringify(current));
          $("#amount-collected").text(
            current["amountCollected"].toLocaleString("it-IT", {
              style: "currency",
              currency: "VND"
            })
          );
        }, 1500);
      }
    }, 1000);
  } else {
    clearInterval(time);
    defLottery = "------";
    $("#lottery-user h1").text(defLottery);
    setTimeout(() => {
      alert("Please add more cash");
      $("#btn-lottery-rand").text("Get Number");
    }, 1200);
  }
});

function getResult() {
  var ranks = [rank8, rank7, rank6, rank5, rank4, rank3, rank2, rank1];
  var totalAmount = 0;

  // Get amount from rank 8
  if (rank8.includes(Number(defLottery.charAt(defLottery.length - 1)))) {
    totalAmount += 4000;
  }

  // Get amount from rank 7
  totalAmount +=
    rank7.filter(
      rank => rank == defLottery.slice(defLottery.length - 2, defLottery.length)
    ).length * 6000;

  // Get amount from rank 6
  totalAmount +=
    rank6.filter(
      rank => rank == defLottery.slice(defLottery.length - 3, defLottery.length)
    ).length * 10000;

  // Get amount from rank 5
  totalAmount +=
    rank5.filter(
      rank => rank == defLottery.slice(defLottery.length - 4, defLottery.length)
    ).length * 50000;

  // Get amount from rank 4
  totalAmount +=
    rank4.filter(
      rank => rank == defLottery.slice(defLottery.length - 4, defLottery.length)
    ).length * 100000;

  // Get amount from rank 3
  if (
    rank3.includes(
      Number(defLottery.slice(defLottery.length - 5, defLottery.length))
    )
  ) {
    totalAmount += 500000;
  }

  // Get amount from rank 2
  totalAmount +=
    rank2.filter(
      rank => rank == defLottery.slice(defLottery.length - 5, defLottery.length)
    ).length * 1000000;

  // Get amount from rank 1
  if (rank3.includes(Number(defLottery))) {
    totalAmount += 10000000;
  }

  return totalAmount;
}

$("#btn-withdraw").click(() => {
  if (confirm("Are u sure want to withdraw all amount collected ?")) {
    var amountCollected = JSON.parse(localStorage.getItem("currentPlay"));
    amountCollected["user"]["amount"] += amountCollected["amountCollected"];
    amountCollected["amountCollected"] = 0;
    localStorage.setItem("currentPlay", JSON.stringify(amountCollected));
    $("#amount-collected").text(
      amountCollected["amountCollected"].toLocaleString("it-IT", {
        style: "currency",
        currency: "VND"
      })
    );
    $("#user-amount").text(
      amountCollected["user"]["amount"].toLocaleString("it-IT", {
        style: "currency",
        currency: "VND"
      })
    );
    $("#btn-withdraw").attr("disabled", "disabled");
  }
});

$("#btn-reset-lottery").click(() => {
  if (confirm("Do u want to get a new Lottery ?")) {
    var amount = JSON.parse(localStorage.getItem("currentPlay"));
    if (amount["user"]["amount"] > 20000) {
      amount["user"]["amount"] -= 20000;
    } else if (amount["user"]["amount"] > 2000) {
      amount["user"]["amount"] -= 10000;
    } else {
      alert("Action fail");
    }
    localStorage.setItem("currentPlay", JSON.stringify(amount));
    $("#user-amount").text(
      amount["user"]["amount"].toLocaleString("it-IT", {
        style: "currency",
        currency: "VND"
      })
    );

    $("#lottery-today table").css("display", "none");
    $("#lottery-today").append(
      '<i class="fas fa-spinner fa-pulse text-center d-block"></i>'
    );
    setTimeout(() => {
      $("#lottery-today table").css("display", "block");
      $("#lottery-today i").remove();
      getLotteryToday();
      alert("New Lottery is updated !");
    }, 2000);
  }
});
