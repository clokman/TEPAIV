// Helper method for `timeout`
const timeStep = {

    timeOfLastStep: 0,
    stepDuration: 200,

    next: function ( callbackFunction, oneTimeCustomStepDuration ) {
        setTimeout( () => {
            callbackFunction.call( this )
        }, timeStep.calculateNextTimeStep( oneTimeCustomStepDuration ) )
    },

    calculateNextTimeStep: ( oneTimeCustomStepDuration ) => {
        const timeOfThisStep = ( oneTimeCustomStepDuration
                ? timeStep.timeOfLastStep + oneTimeCustomStepDuration
                : timeStep.timeOfLastStep + timeStep.stepDuration
        )
        timeStep.timeOfLastStep = timeOfThisStep
        return timeOfThisStep
    },

    reset: () => {
        timeStep.timeOfLastStep = 0
    }

}