var formField = (['$compile', '$timeout', function ($compile, $timeout) {
    return {
        restrict: 'E',
        template: function (tElement, tAttrs) {

            var template;

            switch (tAttrs.type) {
                case 'select':
                    template = require('./form-select.view.html');
                    break;

                case 'date':
                    template = require('./form-date.view.html');
                    break;

                default:
                    template = require('./form-field.view.html');
            }

            return template;

        },
        scope: true,

        controller: function ($scope) {

            $scope.findRegex = function (key) {
                switch (key) {
                    case 'alpha':
                        return /^[a-zA-Z]+$/;
                    case 'numeric':
                        return /^[0-9]+$/;
                    case 'email':
                        return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                    case 'underage':
                        return /^[0-9]+$/;
                    case 'creditcard':
                        return /^\d{13,19}$/;
                    case 'giftcard':
                        return /^[0-9]{8,16}$/;
                    default:
                        return false;
                }
            };

            $scope.verify = function (value, pattern) {
                if (!value) {
                    return '';
                }
                return value.match(pattern) !== null;
            };


            $scope._listeners = {

                text: function () {

                    // Reset
                    $scope[this.model] = (angular.isUndefined($scope[this.model])) ? '' : $scope[this.model];
                    model = $scope.$eval(this.model);
                    modelForm = $scope.form[this.model];


                    // Validating each require
                    Object.keys(this.validate, function (key, data) {
                        var regex = (data.pattern) ? data.pattern : $scope.findRegex(key);
                        if (!regex) return false;

                        modelForm.$setValidity(key, $scope.verify(model, regex));
                    });

                    var isInvalid = modelForm.$dirty && modelForm.$invalid;
                    var isSubmitted = $scope.form.$submitted && modelForm.$invalid;

                    return isSubmitted || isInvalid;

                },

                select: function () {

                    // Reset
                    $scope[this.model] = (angular.isUndefined($scope[this.model])) ? '' : $scope[this.model];
                    model = $scope.$eval(this.model);
                    modelForm = $scope.form[this.model];


                    // Validating each require
                    Object.keys(this.validate, function (key, data) {
                        var regex = (data.pattern) ? data.pattern : $scope.findRegex(key);
                        if (!regex) return false;

                        modelForm.$setValidity(key, $scope.verify(model, regex));
                    });

                    var isInvalid = modelForm.$dirty && modelForm.$invalid;
                    var isSubmitted = $scope.form.$submitted && modelForm.$invalid;

                    return isSubmitted || isInvalid;

                },

                date: function () {


                    if (this.data.length !== 3) {
                        console.error("Date must have 3 inputs");
                        return;
                    }

                    var model;
                    var modelForm;
                    var isDirty = false;
                    var isRequired = false;
                    var isValid = false;
                    var isInvalid = true;
                    var isUnderAge = false;
                    var date = {
                        month: this.data[0],
                        day: this.data[1],
                        year: this.data[2]
                    };


                    // Reset
                    model = $scope.$eval(this.model);
                    modelForm = $scope.form[this.model];


                    if (
                        (!!$scope.form[$scope.newInputs.month.model].$modelValue || $scope.form[$scope.newInputs.month.model].$dirty) &&
                        (!!$scope.form[$scope.newInputs.day.model].$modelValue || $scope.form[$scope.newInputs.day.model].$dirty) &&
                        (!!$scope.form[$scope.newInputs.year.model].$modelValue || $scope.form[$scope.newInputs.year.model].$dirty)
                    ) {
                        isDirty = true;
                    }

                    // Set blurred state based on the three fields if there is a value autopopulated
                    if (
                        ($scope.form[$scope.newInputs.month.model].$untouched && !!date.month) &&
                        ($scope.form[$scope.newInputs.day.model].$untouched && !!date.day) &&
                        ($scope.form[$scope.newInputs.year.model].$untouched && !!date.year)
                    ) {
                        $scope.hasBlurred = true;
                    } else { // set the blurred state after the user blurs those fields
                        $scope.hasBlurred = ($scope.hasBlurred || ($scope.hasBlurredMonth && $scope.hasBlurredDay && $scope.hasBlurredYear));
                    }
                        // IF REQUIRED
                        if (angular.isDefined(this.validate.required)) {

                            if (
                                isDirty &&
                                !date.month &&
                                !date.day &&
                                !date.year

                            ) {
                                isRequired = true;
                            } else {
                                isRequired = false;
                            }

                        }


                        // If the 3 fields are completed (if required or not)
                        if (date.year && date.month && date.day && !isRequired) {


                            model = date.month + '/' + date.day + '/' + date.year;


                            // Validating the Date with Momentjs
                            var date = new Date(model);
                            isValid = moment(model, 'M/D/YYYY', true).isValid();
                            isInvalid = !isValid;

                            var diffYears = moment().diff(date, 'years');

                            // If the difference is more than 110
                            isInvalid = (diffYears >= 110 || isInvalid) ? true : false;

                            // If underage is defined
                            if (angular.isDefined(this.validate.underage)) {
                                var age = (angular.isDefined(this.validate.underage.age) && parseInt(this.validate.underage.age)) ? parseInt(this.validate.underage.age) : 21;
                                isUnderAge = (diffYears < age) ? true : false;
                            }

                        }


                        modelForm.$setValidity('required', !isRequired);
                        modelForm.$setValidity('invalid', !isInvalid);
                        modelForm.$setValidity('underage', !isUnderAge);


                        if (isRequired) {
                            return isDirty && isRequired;
                        }

                        //return isTouched && isInvalid || isUnderAge;
                        return isInvalid || isUnderAge;

                    }, // end date method

                    phone: function () {

                        // Reset
                        $scope[this.model] = (angular.isUndefined($scope[this.model])) ? '' : $scope[this.model];
                        var model = $scope.$eval(this.model);
                        var modelForm = $scope.form[this.model];
                        var maskLength = $scope.$eval(this.model + '_mask').split('_').length - 1;

                        Object.keys(this.validate, function (key, data) {

                            if (key === 'invalid') {

                                modelForm.$invalid = (!model) ? false : (model.length < maskLength) ? false : true;

                                modelForm.$setValidity(key, modelForm.$invalid);
                            } else {
                                var regex = (data.pattern) ? data.pattern : $scope.findRegex(key);
                                if (!regex) return false;

                                modelForm.$setValidity(key, $scope.verify(model, regex));
                            }
                        });

                        var isInvalid = modelForm.$invalid;
                        var isSubmitted = $scope.form.$submitted && modelForm.$invalid;

                        return isSubmitted || isInvalid;

                    }

                };

        },

        link: function (scope, element, attrs) {



            /*
            ** Variables
            ************************************/
            // var status;
            scope.fieldIsInvalid = false;
            scope.hasBlurred = false;
            var type = attrs.type;
            var isMultiple = (type === 'date' || type === 'ccv') ? true : false;
            var fieldsMultiple = (type === 'date') ? ['month', 'day', 'year'] : null;
            var model = (isMultiple) ? '_hidden_' + fieldsMultiple[0] : attrs.model;
            var newInputs = (fieldsMultiple && isMultiple) ? {} : null;



            /*
            ** required attributes
            ************************************/
            if (angular.isUndefined(attrs.type)) {
                console.error('Please verify the required attributes for ' + model);
                return;
            }



            /*
            ** (MULTIPLE) Getting attributes with config as an object
            ************************************/
            if (isMultiple) {
                angular.forEach(fieldsMultiple, function (data) {
                    newInputs[data] = scope.$eval(attrs[data]);
                });
            }



            /*
            ** Elements
            ************************************/
            var fields = element.find('.field-input');
            var common = element.find('.field-common');
            var ng_messages = element.find('ng-messages, [ng-messages]');
            var _form = element.closest('ng-form,form').attr('name');



            /*
            ** Validate object
            ************************************/
            var validate = scope.$eval(attrs.validate);
            // Is validate is undefined, I create a empty object to prevent errors
            if (angular.isUndefined(validate)) {
                validate = {};
            }



            /*
            ** (DATE) Validate:invalid is mandatory
            ************************************/
            if (type === 'date' && angular.isUndefined(validate.invalid)) {
                validate.invalid = {
                    value: "invalid by default"
                };
            }



            /*
            ** Setting the scope for the template
            ************************************/
            scope.form = scope.$parent[_form]; // Form Scope
            scope.model = model; // Model (different than ngModel)
            scope.fieldsMultiple = (isMultiple) ? fieldsMultiple : null; // Model (different than ngModel)
            scope.newInputs = (isMultiple) ? newInputs : null; // Model (different than ngModel)
            scope.type = type;
            scope.label = attrs.label;
            scope._id = attrs.id || 'field-' + scope.model.replace('.', '-').toLowerCase();
            scope.options = (angular.isDefined(attrs.options)) ? scope.$eval(attrs.options) : null;
            scope.placeholder = (angular.isDefined(attrs.placeholder)) ? attrs.placeholder : null;


            if (isMultiple) {
                fields.each(function ($index) {
                    var $this = angular.element(this);
                    var name = $this.attr('field-name');
                    $this.attr({
                        'ng-model': newInputs[name].model,
                        'name': newInputs[name].model
                    });
                });

                // Creating a fake input to save the validation
                common.attr({
                    'ng-model': model,
                    'name': model
                });


            } else {
                fields.attr({
                    'ng-model': scope.model,
                    'name': scope.model
                });

                if (angular.isDefined(validate.required)) {
                    fields.attr('required', true);
                }

                // Maxlength
                if (angular.isDefined(attrs.maxlength)) {
                    fields.attr('maxlength', attrs.maxlength);
                }

                // Minlength
                if (angular.isDefined(attrs.minlength)) {
                    fields.attr('minlength', attrs.minlength);
                }

                // Change
                if (angular.isDefined(attrs.change)) {
                    fields.attr('ng-change', attrs.change);
                }


                // Types
                if (type === 'phone') {
                    //scope.phoneMask( fields );
                    fields.attr('phone-mask', true);
                }
            }


            // Messages for the errors
            scope.messages = [];
            Object.keys(validate, function (key, data) {
                scope.messages.push({
                    when: key,
                    value: data.value
                })
            });

            // Adding "for" in messages
            ng_messages.attr('for', _form + '.' + model + '.$error');







            /*
            ** Watching model of Day, Month and Year for any changes
            ************************************/

            var toWatch = [];

            if (newInputs) {
                Object.keys(newInputs, function (data) {
                    toWatch.push(newInputs[data].model);
                });

            } else {
                toWatch.push(model);
            }



            scope.isInvalid = function (data) {


                var value = (data) ? data : scope[model];
                var listenerType = (type !== 'date' && type !== 'phone') ? 'text' : type;

                if (isMultiple && !angular.isArray(data)) {
                    return;
                }

                if (angular.isDefined(scope._listeners[listenerType])) {

                    // Setting up the variables I need
                    scope._listeners.model = model;
                    scope._listeners.data = value;
                    scope._listeners.validate = validate;


                    // Calling the listener

                    scope.fieldIsInvalid = scope._listeners[listenerType]();

                    if (angular.isUndefined(scope.fieldIsInvalid)) {
                        scope.fieldIsInvalid = false;
                    }

                    return scope.fieldIsInvalid;

                }
            };



            if (isMultiple) {
                scope.$watchGroup(toWatch, function (data) {
                    scope.isInvalid(data);
                }, true);
            }


            /*
            ** Compile new attributes
            ************************************/
            $compile(fields)(scope);
            $compile(common)(scope);
            $compile(ng_messages)(scope);

            if (type === 'select') {
                $timeout(function () {
                    $compile(fields)(scope);
                });
            }


            // If placeholder method exist is because the user is using IE9 and we need to create a fake placeholder
            if (angular.isDefined(jQuery.fn.placeholder)) {
                // jQuery('[placeholder]').placeholder();
            }


            if (type === 'select' || type === 'date') {
                $timeout(function () {
                    $(element).find('select').width($(element).find('select').width());
                }, 100);
            }


        } // end link
    }
}]);

module.exports = formField;
