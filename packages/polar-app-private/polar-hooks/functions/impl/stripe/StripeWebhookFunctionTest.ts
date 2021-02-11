import {assert} from 'chai';
import {Accounts} from "./Accounts";
import {Billing} from "polar-accounts/src/Billing";
import V2PlanPlus = Billing.V2PlanPlus;

xdescribe('StripeWebhookFunction', function() {

    it("basic", async function() {
        this.timeout(5000);
        await Accounts.changePlan('live',"cus_F9RB6dZIxRMZXj", {plan: V2PlanPlus, interval: 'month'});

        const account = await Accounts.get('burton@inputneuron.io');

        assert.isDefined(account);
        assert.equal(account!.plan, 'bronze');

    });

    xit("config existing users.", async function() {
        this.timeout(500000);

        const bronze = [
            "polar-bookshelf@marijnpool.nl",
            "iamdtg@gmail.com",
            "mpenterprises.org@gmail.com",
            "ks+accts@ksroot.me",
            "isennovskiy@gmail.com",
            "garrett@blvrd.co",
            "marvindanker@gmail.com",
            "polar.account@sa1.me",
            "mrkjduncan@gmail.com",
            "lucasl2000@gmail.com",
            "lindsaywaterman@gmail.com",
            "seanmorgan@outlook.com",
            "john.repko@pikasoft.com",
            "d@f26.at",
            "andrewf@posteo.pm",
            "tmarice@gmail.com",
            "cogni.dizz@outlook.com",
            "jstillwa@nota404.com",
            "heliostatic@gmail.com",
            "hector.dearman@gmail.com",
            "jochen.krattenmacher@web.de",
            "arnaud@btmx.fr",
            "mohangk@gmail.com",
            "lwx169@gmail.com",
            "bajgrowiczp@gmail.com",
            "chexxor@gmail.com",
            "michael.pereira@neuro.fchampalimaud.org",
            "felixcodeboy@gmail.com",
        ];

        const silver = [
            "folcon@gmail.com",
            "adampf@gmail.com",
            "vrostovtsev@protonmail.com",
            "ben.zalasky@gmail.com",
            "kelseylarson89@gmail.com",
            "polar@rachelblum.com",
            "ecpostema@gmail.com",
            "mateusaraujoborges@gmail.com",
            "jbwhit@gmail.com",
            "leogodin217@gmail.com",
            "josh@joshisanerd.com",
            "ahd2125@columbia.edu",
            "billy.breuer@ad-juster.com",
            "hyttynen+opencollective@gmail.com",
            "sg.carol@gmail.com",
        ];

        const gold = [
            "etc@defel.carina.uberspace.de",
            "clement@mux.me",
        ];

        for (const email of bronze) {

            try {
                await Accounts.changePlanViaEmail(email, '1234', "bronze", 'month');
                console.log("WORKED");
            } catch (e) {
                console.error(e);
            }

        }

        for (const email of silver) {
            try {
                await Accounts.changePlanViaEmail(email, '1234', "silver", 'month');
                console.log("WORKED");
            } catch (e) {
                console.error(e);
            }
        }

        for (const email of gold) {
            try {
                await Accounts.changePlanViaEmail(email, '1234', "gold", 'month');
                console.log("WORKED");
            } catch (e) {
                console.error(e);
            }
        }

    });

});


