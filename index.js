/**
 * Krunker RGB Sky
 * @name krunker-rgb-sky
 * @author hitthemoney
 * @param {*} app 
 * @namespace https://github.com/hitthemoney/krunker-plugins/blob/main/rgbsky.user.js
 * @returns {void}
 */

module.exports.init = ({ store }) => {
    let startCol = store.get("RGBStart") || "red";
    let endCol = store.get("RGBEnd");
    let kr;

    // Prevents sky dome from generating and calls the init function
    Object.defineProperty(Object.prototype, "skyC", {
        enumerable: false,
        get() {
            init();
            return startCol;
        }
    })

    // Hooks renderer
    Object.defineProperty(Object.prototype, "renderer", {
        enumerable: false,
        get() {
            kr = this;
            return this._renderer;
        },
        set(v) {
            this._renderer = v;
        }
    })

    // Main Function
    var init = (() => {
        let hasRan = false;
        let hue = 0;
        let color = startCol;
        return () => {
            if (!!kr.renderer && !hasRan) {
                color = new(kr.renderer.getClearColor()).constructor(color);
                hasRan = true;
                startCol = color.getHSL({}).h;
                if(endCol) endCol = new(kr.renderer.getClearColor()).constructor(endCol).getHSL({}).h;
                
                let operator = "+";
                let changeColor = () => {
                    let bc = color.getHSL({});
                    color.setHSL(hue, bc.s, bc.l);
                    kr.renderer.setClearColor(color);
                    if(endCol){
                        eval(`hue ${operator}= 0.01`);
                        if(hue == startCol) operator = "+";
                        if(hue == endCol) operator = "-";
                    } else {
                        hue += 0.01;
                    }
                    setTimeout(changeColor, 100 / (store.get("RGBSpeed") || 5));
                }
                changeColor();
            }
        }
    })();
}

module.exports.settings = [
    {
        label: "RGB Sky",
        id: "rgb_sky",
        items: [
            {
                type: "RANGE",
                label: "Speed",
                id: "speed",
                min: "1",
                max: "10",
                step: "1",
                value: "5",
                storeKey: "RGBSpeed",
                cb: (val, store) => store.set("RGBSpeed", val)
            }, {
                type: "COLOR",
                label: "Start Color",
                buttonId: "rgbstart_btn",
                storeKey: "RGBStart",
                cb: (value, store) => store.set("RGBStart", value),
                requireRestart: true
            }, {
                type: "COLOR",
                label: "End Color",
                buttonId: "rgbend_btn",
                storeKey: "RGBEnd",
                cb: (value, store) => store.set("RGBEnd", value),
                requireRestart: true
            }, {
                type: "BUTTON",
                label: "Reset Colors",
                buttonId: "rgbreset_btn",
                buttonLabel: "Reset",
                cb: (store) => {
                    store.delete("RGBStart");
                    store.delete("RGBEnd");
                },
                requireRestart: true,
            }
        ]
    }
]