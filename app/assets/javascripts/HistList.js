function toCamelCase(str) { return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function clearMem() {
  chrome.storage.local.remove("SCHistory");
}

var HistList = React.createClass({displayName: "HistList",
  getInitialState: function () {
    return {
      songList: [{
        img: "",
        title: "",
        url: ""
      }]
    }
  },

  _getSongList: function () {
    var that = this;
    chrome.storage.local.get("SCHistory", function (items) {
      that.setState({
        songList: items.SCHistory || []
      });
    });
  },

  componentWillMount: function () {
    this._getSongList();
  },

  clearHist: function () {
    clearMem();
    this._getSongList();
  },

  render: function () {
   return (
     React.createElement("span", {id: "no-blur"}, 
        React.createElement("div", null, 
          React.createElement("div", {id: "clear", onClick: this.clearHist}, "Clear"), 
          
            this.state.songList.reverse().map(function (el, i, arr) {
              return React.createElement(Song, {key: i, imgStyle: el.img, title: el.title, url: el.url, i: i/(arr.length-1 || 1)})
            })
          
        )
      )
    );
  }
});

var Song = React.createClass({displayName: "Song",
  getDefaultProps: function () {
    return {
      imgStyle: "",
      url: "",
      title: "",
      i: 0
    }
  },

  render: function () {
    var fin = {
      "backgroundSize": "cover"
    };
    var p = /([\w-]+):\s?([^;]*)/g;
    var m;
    console.log(this.props.imgStyle);
    while ( (m = p.exec(this.props.imgStyle)) !== null) {
      console.log(m[1], ":", m[2]);
      fin[toCamelCase(m[1])] = m[2];
    }
    var divider;
    if (this.props.i < 1)
      divider = React.createElement("hr", {className: "divider"});
    else
      divider = "";
    return (
      React.createElement("div", {className: "song"}, 
        React.createElement("a", {href: this.props.url, target: "_blank"}, 
          React.createElement("div", null, 
            React.createElement("span", {style: fin}), 
            React.createElement("div", {className: "song-title"}, 
              this.props.title
            )
          )
        ), 
        divider
      )
    )
  }
});

ReactDOM.render(
  React.createElement(HistList, null),
  document.getElementById("react")
);
