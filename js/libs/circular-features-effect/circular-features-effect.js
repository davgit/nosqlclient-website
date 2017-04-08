/**
 * Created by Asus on 31.03.2017.
 */


var CFEffects = (function () {
    var element; // Original feature list
    var clonedElement; // Cloned feature list
    var targetElement; // Target element which will be container of CFEffect
    var cfEffectCirle; // Circular features effect dom element
    var rotationVelocity = 10; // Rotation velocity
    var originalActiveFeature; // Original active feature
    var logEnabled = false;
    var inputEnabled = true;


    function log(lg) {
        if (logEnabled)
            console.log(lg);
    }


    function disableInput() {
        inputEnabled = false;
    }

    function enableInput() {
        inputEnabled = true;
    }

    function isInputEnabled() {
        return inputEnabled;
    }

    /**
     * Register original features dom element to CFE
     */
    function registerElement(e) {
        log("Element ");
        switch (typeof e) {
            case "string":
                element = $("#" + e); // If e is elements id
                break;
            case "object":
                element = e; // If e is jquery object
                break;
        }

        return true;
    }


    /**
     * Register onclick event
     */
    function activateClickEvent() {
        $(".cfe-feature").click(function () {
            if (isInputEnabled()) {
                disableInput();
                var elClone = $(this).clone(true);
                var feature = $(this);
                if (typeof originalActiveFeature != "undefined") {
                    returnToOriginalPosition(); // Current active feature go back to original position
                }
                var featureCurrentPosition = getFeatureCurrentPosition(feature); // Find original feature position
                //feature.hide(); // Hide the original feature, it will replace with clone

                elClone.css({
                    'position': 'absolute',
                    'left': featureCurrentPosition.left,
                    'top': featureCurrentPosition.top
                }).removeClass("reverse-rotating"); // Replace clone with original feature
                targetElement.append(elClone); // Append clone to target element
                setTimeout(function () {
                    elClone.addClass("cfe-active-feature"); // Add animation
                    elClone.css({'position': '', 'left': '', 'top': ''}); // Remove clone's left and top and send it to center
                    setTimeout(function () {
                        renderFeatureInfo(elClone); // Render inside of active current feature
                        setTimeout(function () {
                            originalActiveFeature = feature; // Save active current feature
                            enableInput();
                        }, 450);
                    }, 400);
                }, 5);
            }
        });
    }


    /**
     * Current active feature backs to original feature position
     */
    function returnToOriginalPosition() {
        //originalActiveFeature.show(); // Change display but invisible
        var activeFeatureClone = $(".cfe-active-feature");
        setTimeout(function () {
            activeFeatureClone.find(".cfe-feature-title").css('font-size', '');
            activeFeatureClone.find(".cfe-info").css('font-size', '0px').removeClass("active");
            activeFeatureClone.css({
                'left': (targetElement.width() / 2),
                'top': (targetElement.height() / 2),
                'width': '30px',
                'height': '30px',
                'opacity': 0
            }); // To center of circle
            setTimeout(function () {
                activeFeatureClone.remove();
            }, 710);
        }, 100);
    }

    /**
     * Renders feature info
     * @param el
     */
    function renderFeatureInfo(el) {
        var description = el.attr("data-description");
        var title = el.attr("data-title");
        el.html("<div class='cfe-info' ><div class='cfe-feature-title' >" + title + "</div><div class='cfe-feature-description'>" + description + "</div></div>");
        setTimeout(function () {
            el.find(".cfe-info").addClass("active");
        }, 20);
    }

    function getRotationDegrees(obj) {
        var matrix = obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");
        if (matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        } else {
            var angle = 0;
        }
        return (angle < 0) ? angle + 360 : angle;
    }

    /**
     * Find original feature current position
     * @param featureElement
     * @returns {{left: number, top: number}}
     */
    function getFeatureCurrentPosition(featureElement) {
        var featureOffset = featureElement.offset();
        var targetOffset = targetElement.offset();
        return {left: featureOffset.left - targetOffset.left, top: featureOffset.top - targetOffset.top};
    }

    /**
     * Render circular virtual dom element
     */
    function renderEffectContainer(targetId) {
        log("Effect container rendered");
        cfEffectCirle = $("<div></div>");
        cfEffectCirle.attr("id", "CFEcontainer").addClass("cfe-container");
        targetElement = $("#" + targetId);
        targetElement.append(cfEffectCirle);
    }

    /**
     * Append cloned features to CFE container
     */
    function featuresToContainer() {
        log("Features appended to container");
        cfEffectCirle.append(clonedElement);
    }

    /**
     * Start to CFE container rotation
     */
    function rotateContainer() {
        log("Rotation started");
        cfEffectCirle.addClass("active rotating");
    }

    /**
     * Inner features element are reverse rotating
     */
    function reverseRotateFeatures() {
        log("Reverse rotation started");
        clonedElement.find(">*").addClass("cfe-feature active reverse-rotating");
    }

    /**
     * Set features position full symmetric circle
     */
    function setFeaturesPositions() {
        var features = $(".cfe-feature"),
            container = cfEffectCirle,
            width = container.width(),
            height = container.height(),
            angle = 0,
            step = (2 * Math.PI) / features.length;
        var radius = width / 2; // radius of the circle
        features.each(function () {
            var x = Math.round(width / 2 + radius * Math.cos(angle) - $(this).width() / 2),
                y = Math.round(height / 2 + radius * Math.sin(angle) - $(this).height() / 2);
            $(this).css({
                left: x + 'px',
                top: y + 'px'
            });
            angle += step;
        });
    }

    /**
     * Stop rotation
     */
    function stopContainer() {
        log("Rotation stopped");
        cfEffectCirle.removeClass("active rotation")
    }

    /**
     * Set rotation speed
     * @param v
     */
    function setRotationSpeed(v) {
        log("Rotation speed changed: " + v);
        rotationVelocity = v;
        cfEffectCirle.css({
            "-webkit-animation-duration": rotationVelocity + "s",
            "animation-duration": rotationVelocity + "s"
        });
        $(".cfe-feature").css({
            "-webkit-animation-duration": rotationVelocity + "s",
            "animation-duration": rotationVelocity + "s"
        });

    }

    /**
     * Clone features list to virtual variable
     */
    function cloneFeatures() {
        log("Features have been cloned");
        clonedElement = element.clone(true);
    }

    /**
     * Hide actual features container
     */
    function hideFeatures() {
        element.hide();
    }

    /**
     * Initialize
     * @param params
     */
    function init(params) {
        params.rotationVelocity = params.rotationVelocity || rotationVelocity; // If rotation velocity is undefined

        log("Circular features effect initialized");
        log(params);
        registerElement(params.element); // Register element
        renderEffectContainer(params.targetId); // Render circular element
        cloneFeatures(); // Clone original features element
        hideFeatures(); // Hide original features element
        featuresToContainer(); // Clone features to cfeContainer
        rotateContainer(); // Start to rotation
        reverseRotateFeatures(); // Start to reverse rotating inner elements
        setFeaturesPositions();
        setRotationSpeed(params.rotationVelocity);
        activateClickEvent();
    }

    return {
        init: init,
        getCFECircle: cfEffectCirle
    };
})();