require('../ui/bookingengine/app/booking/modules/booking-engine-libs.init');
require('../ui/bookingengine/app/booking/modules-sape/sape-common.init');
require('angular-mocks/angular-mocks');

describe('formfield.directive', function () {

    var $rootScope, $compile, $httpBackend, scope, form;
	

	beforeEach(function () {
	  // Load module...
	    angular.mock.module('sapeCommon');

	  // Injections...
	  angular.mock.inject(function (_$rootScope_, _$compile_) {
	      scope = _$rootScope_.$new();
	      $compile = _$compile_;
	  });
	 
	});

    // Unit Testing

    describe("date type", function () {

    	var element, day, month, year, _hidden, todaysDate;

    	beforeEach(function () {

    	   var html = formHTML('date', { 
    	       underage: { value: 'is underage' },
    	       valid: { value: 'is valid' }
    	   });

	       element = $compile(html)(scope).find('form-field');
	       scope.$digest();
	       day = element.find('[field-name="day"]');
	       month = element.find('[field-name="month"]');
	       year = element.find('[field-name="year"]');
	       _hidden = element.find('input.field-common');
	    });

    	 describe("should validate creation of field", function() {

		    it("should add the correct model to day field", function() {
		    	expect( day.attr('ng-model') ).toBe(element.scope().newInputs.day.model);
		    });

		    it("should add the correct name to the day", function() {
		    	expect( day.attr('name') ).toBe(element.scope().newInputs.day.model);
		    });

		    it("should add the correct model to month field", function() {
		    	expect( month.attr('ng-model') ).toBe(element.scope().newInputs.month.model);
		    });

		    it("should add the correct name to the month", function() {
		    	expect( month.attr('name') ).toBe(element.scope().newInputs.month.model);
		    });

		    it("should add the correct model to year field", function() {
		    	expect( year.attr('ng-model') ).toBe(element.scope().newInputs.year.model);
		    });

		    it("should add the correct name to the year", function() {
		    	expect( year.attr('name') ).toBe(element.scope().newInputs.year.model);
		    });
	    });

		 describe("should validate", function() {

		 	it("false if user enters invalid day", function() {
		 		scope.testForm.monthField.$setViewValue( moment().format('MM') );
		 		scope.testForm.dayField.$setViewValue( 'meh' );
		 		scope.testForm.yearField.$setViewValue( moment().format('DD') );
		 		expect(!!scope.testForm.$error.invalid).toBe(true);
		 	});

		 	it("false if user enters invalid month", function () {
		 	    scope.testForm.monthField.$setViewValue( 'meh' );
		 	    scope.testForm.dayField.$setViewValue( moment().format('DD') );
		 	    scope.testForm.yearField.$setViewValue( moment().format('YY') );
		 	    expect(!!scope.testForm.$error.invalid).toBe(true);
		 	});

		 	it("false if user enters invalid year", function () {
		 	    scope.testForm.monthField.$setViewValue( moment().format('MM') );
		 	    scope.testForm.dayField.$setViewValue( moment().format('DD') );
		 	    scope.testForm.yearField.$setViewValue( '0101' );
		 	    expect(!!scope.testForm.$error.invalid).toBe(true);
		 	});

		 	it("true if user enters valid date", function () {
		 	    scope.testForm.monthField.$setViewValue( moment().format('MM') );
		 	    scope.testForm.dayField.$setViewValue( moment().format('DD') );
		 	    scope.testForm.yearField.$setViewValue( moment().format('YYYY') );
		 	    expect(!!scope.testForm.$error.invalid).toBe(false);
		 	});

		 	it("false if user is under 21 years old", function() {
		 		scope.testForm.monthField.$setViewValue( moment().format('MM') );
		 		scope.testForm.dayField.$setViewValue( moment().format('DD') );
		 		scope.testForm.yearField.$setViewValue( moment().subtract(15, 'years').format('YYYY') );
		 		expect(!!scope.testForm.$error.underage).toBe(true);
		     });

		     it("true if user is over 21 years old", function() {
		 		scope.testForm.monthField.$setViewValue(moment().format('MM'));
		 		scope.testForm.dayField.$setViewValue(moment().format('DD'));
		 		scope.testForm.yearField.$setViewValue( moment().subtract(21, 'years').format('YYYY') );
		 		expect(!!scope.testForm.$error.underage).toBe(false);
		     });

		 });



    });

    describe("select type", function () {

    	var element, field;

    	 describe("should validate creation of field", function() {
	    	 beforeEach(function () {
	    	   var html = formHTML('select', { 
					required: { value: 'is required' } 
	    	   });

		       element = $compile(html)(scope).find('form-field');
		       scope.$digest();
		       field = element.find('select.field-input');
		    });

		    it("should add the correct model to the field", function() {
		    	expect( field.attr('ng-model') ).toBe(element.scope().model);
		    });

		    it("should add the correct name to the field", function() {
		    	expect( field.attr('name') ).toBe(element.scope().model);
		    });

		    it("should add the correct id to the field", function() {
		    	expect( field.attr('id') ).toBe(element.scope()._id);
		    });

		    it("should only have as many options as they are passed - not empty option as null", function () {
		        var optionsInHTMLCount = field.find('option').length;
		        expect(optionsInHTMLCount).toBe(3); // two options + the placeholder
		    });

		    it("should have placeholder class if it has a placeholder that is selected", function () {
		        field.find('option').first().attr('selected', true); // select the first option which is the placeholder
		        expect(field.hasClass('placeholder')).toBe(true);
		    });

		    it("should not have placeholder class if an option other than placholder is selected", function () {
		        field.find('option').last().attr('selected', true); // select the last option
		        expect(field.hasClass('placeholder')).toBe(true);
		    });

	    });

    });

	describe("text type", function () {

	    var element, field;


	    describe("should validate creation of field", function() {
	    	 beforeEach(function () {
	    	   var html = formHTML('text', { 
					required: { value: 'is required' } 
	    	   });

		       element = $compile(html)(scope).find('form-field');
		       scope.$digest();
		       field = element.find('input.field-input');
		    });

		    it("should add the correct model to the field", function() {
		    	expect( field.attr('ng-model') ).toBe(element.scope().model);
		    });

		    it("should add the correct name to the field", function() {
		    	expect( field.attr('name') ).toBe(element.scope().model);
		    });

		    it("should add the correct id to the field", function() {
		    	expect( field.attr('id') ).toBe(element.scope()._id);
		    });
	    });



	    describe("should validate alpha validation", function() {
	    	 beforeEach(function () {
	    	   var html = formHTML('text', { 
					alpha: { value: 'is alpha' } 
	    	   });

		       element = $compile(html)(scope).find('form-field');
		       scope.$digest();
		       field = element.find('input.field-input');
		    });

		    it("to be invalid if user enters number", function() {
		    	scope.testForm.testField.$setViewValue('joe1');
		    	expect( element.scope().isInvalid() ).toBe(true);
		    });

		    it("to be valid if user enters only characters", function() {
		    	scope.testForm.testField.$setViewValue('joe');
		    	expect( element.scope().isInvalid() ).toBe(false);
		    });

		  
	    });


	    describe("should validate giftcard validation", function () {
	        beforeEach(function () {
	            var html = formHTML('text', {
	                giftcard: { value: 'is giftcard' }
	            });

	            element = $compile(html)(scope).find('form-field');
	            scope.$digest();
	            field = element.find('input.field-input');
	        });

	        it("to be invalid if user enters number with less than 8 digits", function () {
	            scope.testForm.testField.$setViewValue('123456');
	            expect(element.scope().isInvalid()).toBe(true);
	        });

	        it("to be invalid if user enters number with more than 16 digits", function () {
	            scope.testForm.testField.$setViewValue('123456781234567812345678');
	            expect(element.scope().isInvalid()).toBe(true);
	        });

	        it("to be invalid if user enters an alpha character", function () {
	            scope.testForm.testField.$setViewValue('123456789e');
	            expect(element.scope().isInvalid()).toBe(true);
	        });

	        it("to be valid if user enters more than 8 digits", function () {
	            scope.testForm.testField.$setViewValue('123456789');
	            expect(element.scope().isInvalid()).toBe(false);
	        });


	    });

	    describe("should validate credit card validation", function () {
	        beforeEach(function () {
	            var html = formHTML('text', {
	                creditcard: { value: 'is creditcard' }
	            });

	            element = $compile(html)(scope).find('form-field');
	            scope.$digest();
	            field = element.find('input.field-input');
	        });

	        it("to be invalid if user enters wrong credit card", function () {
	            scope.testForm.testField.$setViewValue('12345');
	            expect(element.scope().isInvalid()).toBe(true);
	        });

	        it("to be valid if user enters a valid amex", function () {
	            scope.testForm.testField.$setViewValue('378282246310005');
	            expect(element.scope().isInvalid()).toBe(false);
	        });

	        it("to be valid if user enters a valid visa", function () {
	            scope.testForm.testField.$setViewValue('4264289123422875');
	            expect(element.scope().isInvalid()).toBe(false);
	        });

	        it("to be valid if user enters a valid mastercard", function () {
	            scope.testForm.testField.$setViewValue('5105105105105100');
	            expect(element.scope().isInvalid()).toBe(false);
	        });

	        it("to be valid if user enters a valid discover", function () {
	            scope.testForm.testField.$setViewValue('6011000990139424');
	            expect(element.scope().isInvalid()).toBe(false);
	        });


	    });


	     describe("should validate numeric validation", function() {
	    	 beforeEach(function () {
	    	   var html = formHTML('text', { 
					numeric: { value: 'is numeric' } 
	    	   });

		       element = $compile(html)(scope).find('form-field');
		       scope.$digest();
		       field = element.find('input.field-input');
		    });

		    it("to be invalid if user enters character", function() {
		    	scope.testForm.testField.$setViewValue('123a');
		    	expect( element.scope().isInvalid() ).toBe(true);
		    });

		    it("to be valid if user enters only numbers", function() {
		    	scope.testForm.testField.$setViewValue('123');
		    	expect( element.scope().isInvalid() ).toBe(false);
		    });

		  
	    });

	      describe("should validate email validation", function() {
	    	 beforeEach(function () {
	    	   var html = formHTML('text', { 
					email: { value: 'is email' } 
	    	   });

		       element = $compile(html)(scope).find('form-field');
		       scope.$digest();
		       field = element.find('input.field-input');
		    });

		    it("to be invalid if user enters an invalid email", function() {
		    	scope.testForm.testField.$setViewValue('carlos@');
		    	expect( element.scope().isInvalid() ).toBe(true);
		    });

		    it("to be valid if user enters a valid email", function() {
		    	scope.testForm.testField.$setViewValue('test@test.com');
		    	expect( element.scope().isInvalid() ).toBe(false);
		    });

		  
	    });
	    

	   


	});

	

   


});


function formHTML(type, validation) {

    var _validation = [];

    for (var v in validation) {
        _validation.push( v + ': \'' + validation[v].value + '\'' );
    }

    if (type === 'date') {
        return '<form name="testForm"><form-field type="date" \
            label="test" \
            month="{ \
    	        type: \'select\', \
		        model: \'monthField\', \
		        placeholder: \'Month\', \
		        options: [ \
			        { \
				        value: 1, \
				        text: \'January\' \
			        }, \
			        { \
				        value: 2, \
				        text: \'Feb\' \
			        }, \
			        { \
				        value: 3, \
				        text: \'Mar\' \
			        } \
		        ] \
            }" \
            day="{ \
    	        type: \'text\', \
		        model: \'dayField\', \
		        placeholder: \'DD\' \
            }" \
            year="{ \
    	        type: \'text\', \
		        model: \'yearField\', \
		        placeholder: \'YYYY\' \
            }" \
            validate="{' + _validation.join(',') + '}"></form-field></form>';

    } else if(type === 'select') {
        return '<form name="testForm"><form-field type="' + type + '" \
	                                id="test-id" \
	                                model="testField" \
	                                label="Test" \
                                    options="[{value: 1, text: \'one\'}, {value: 2, text: \'two\'}]" \
	                                placeholder="First Name" \
	                                validate="{'+ _validation.join(',') + '}">\
	                              </form-field></form>';
    } else {

		return '<form name="testForm"><form-field type="'+type+'" \
	                                id="test-id" \
	                                model="testField" \
	                                label="Test" \
	                                placeholder="First Name" \
	                                validate="{'+_validation.join(',')+'}">\
	                              </form-field></form>';
	}

	
}