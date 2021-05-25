const { time, expectRevert } = require('@openzeppelin/test-helpers');
const FOMC = artifacts.require('FairoxMembershipCoin.sol');

contract('FairoxMembershipCoin', ([alice, bob]) => {

    it('initial mint', async () => {
        let t = await FOMC.new({from: alice});
        let b = await t.balanceOf(alice)
        assert.equal(b, "20000000000000000000000000");
    });

    it('burn', async () => {
        let t = await FOMC.new({from: alice});
        await t.burn("1000000000000000000000000")
        let b = await t.balanceOf(alice)
        assert.equal(b, "19000000000000000000000000");
    });

    it('transfer', async () => {
        let t = await FOMC.new({from: alice});
        await t.transfer(bob, "5000000000000000000000000")
        let b = await t.balanceOf(bob)
        assert.equal(b, "5000000000000000000000000");
    });

    it('extract initial', async () => {
        let t = await FOMC.new({from: alice});

        let last = await t.last_extracted()
        let currTime = await time.latest()
        assert.equal(last, currTime.toString())

        let nextTime = parseInt(currTime, 10) + 31536000
        let next = await t.getNextExtractionAvailable()
        assert.equal(next, nextTime.toString());

        let b = await t.balanceOf(alice)
        assert.equal(b, "20000000000000000000000000");

        let nextTimestamp = parseInt(next.toString()) + 100;
        await time.increaseTo(nextTimestamp)

        await t.extract()
        b = await t.balanceOf(alice)
        assert.equal(b, "20500000000000000000000000");
    });


    it('extract initial and attempt a second extraction on same year', async () => {
        let t = await FOMC.new({from: alice});
        let next = await t.getNextExtractionAvailable()
        let nextTimestamp = parseInt(next.toString()) + 100;
        await time.increaseTo(nextTimestamp)
        await t.extract()
        await time.advanceBlock()
        b = await t.balanceOf(alice)
        assert.equal(b, "20500000000000000000000000");
        await time.advanceBlock()
        await expectRevert(t.extract(), "FOMCERC20: Unable to extract on this period")
    });

    it('perform all extractions for the 10 years', async () => {
        let t = await FOMC.new({from: alice});
        for (let i = 0; i< 10; i++) {
            let next = await t.getNextExtractionAvailable();
            let nextTimestamp = parseInt(next.toString()) + 100;
            await time.increaseTo(nextTimestamp)
            await t.extract()
            await time.advanceBlock()
        }
        let b = await t.balanceOf(alice);
        assert.equal(b, "25000000000000000000000000");
    });

    it('perform all extractions for the 10 years try another one to test failing cap exceed', async () => {
        let t = await FOMC.new({from: alice});

        for (let i = 0; i < 10; i++) {
            let next = await t.getNextExtractionAvailable();
            let nextTimestamp = parseInt(next.toString()) + 100;
            await time.increaseTo(nextTimestamp)

            await t.extract()
        }

        let b = await t.balanceOf(alice);
        assert.equal(b, "25000000000000000000000000");

        let next = await t.getNextExtractionAvailable();
        let nextTimestamp = parseInt(next.toString()) + 100;
        await time.increaseTo(nextTimestamp)

        await expectRevert(t.extract(), "FOMCERC20: There has been already 10 extractions for the supply")
    });

    it('perform all extractions for the 10 years burn some tokens and try to get an extra extraction without cap exceed', async () => {
        let t = await FOMC.new({from: alice});
        for (let i = 0; i< 10; i++) {

            let next = await t.getNextExtractionAvailable();
            let nextTimestamp = parseInt(next.toString()) + 100;
            await time.increaseTo(nextTimestamp)

            await t.extract()
        }
    
        let b = await t.balanceOf(alice);
        assert.equal(b, "25000000000000000000000000");

        await t.burn("10000000000000000000000000")

        let next = await t.getNextExtractionAvailable();
        let nextTimestamp = parseInt(next.toString()) + 100;
        await time.increaseTo(nextTimestamp)

        await expectRevert(t.extract(), "FOMCERC20: There has been already 10 extractions for the supply")

    });

});