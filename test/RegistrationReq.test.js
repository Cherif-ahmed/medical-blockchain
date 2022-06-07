const { assert } = require("chai")

const RegistrationReq = artifacts.require('./RegistrationReq.sol')

contract('RegistrationReq', (accounts) => {
    before(async () => {
        this.RegistrationReq = await RegistrationReq.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.RegistrationReq.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('initializes successfully', async () => {
        const registrationRequestsCount = await this.RegistrationReq.registrationRequestsCount()
        assert.equal(registrationRequestsCount, 0)
    })
    
    it('sends Registration Request', async () => {
        const result = await this.RegistrationReq.AddRegistrationRequest('FirstName', 'LastName', 'example@email.com', '0544886677', '01/01/1986', 'HOMEaddress', 'Male', {from:accounts[2]})
        const registrationRequestsCount = await this.RegistrationReq.registrationRequestsCount()
        const hasRequestedRegistration = await this.RegistrationReq.hasRequestedRegistration(accounts[2])
        const isDeleted = await this.RegistrationReq.isDeleted(accounts[2])
        assert.equal(hasRequestedRegistration, true)
        assert.equal(hasRequestedRegistration, true)
        assert.equal(isDeleted, false)
        assert.equal(registrationRequestsCount, 1)
        const event = result.logs[0].args
        assert.equal(event.email, 'example@email.com')
        assert.equal(event.addr, accounts[2])
    })

    it('deletes registration request', async () => {
        const request = await this.RegistrationReq.AddRegistrationRequest('FirstName', 'LastName', 'example@email.com', '0544886677', '01/01/1986', 'HOMEaddress', 'Male', {from:accounts[2]})
        const result = await this.RegistrationReq.deleteRegistrationRequest(accounts[2])
        const isDeleted = await this.RegistrationReq.isDeleted(accounts[2])
        assert.equal(isDeleted, true)
    })

    
})