import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import reinstallServer from '@/api/server/reinstallServer';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import { Dialog } from '@/components/elements/dialog';
import lang from '../../../../../lang.json';

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [modalVisible, setModalVisible] = useState(false);
    const { addFlash, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const reinstall = () => {
        clearFlashes('settings');
        reinstallServer(uuid)
            .then(() => {
                addFlash({
                    key: 'settings',
                    type: 'success',
                    message: 'Your server has begun the reinstallation process.',
                });
            })
            .catch((error) => {
                console.error(error);

                addFlash({ key: 'settings', type: 'error', message: httpErrorToHuman(error) });
            })
            .then(() => setModalVisible(false));
    };

    useEffect(() => {
        clearFlashes();
    }, []);

    return (
        <TitledGreyBox title={lang.settings_reinstall_server} css={tw`relative`}>
            <Dialog.Confirm
                open={modalVisible}
                title={lang.settings_reinstall_confirm_reinstall}
                confirm={lang.settings_reinstall_confirm_reinstall_button}
                onClose={() => setModalVisible(false)}
                onConfirmed={reinstall}
            >
                {lang.settings_reinstall_server_text_confirmation_text}
            </Dialog.Confirm>
            <p css={tw`text-sm`}>
                {lang.settings_reinstall_server_text}&nbsp;
                <strong css={tw`font-medium`}>

                    {lang.settings_reinstall_server_text_bold}

                </strong>
            </p>
            <div css={tw`mt-6 text-right`}>
                <Button.Danger variant={Button.Variants.Secondary} onClick={() => setModalVisible(true)}>
                {lang.settings_reinstall_server}
                </Button.Danger>
            </div>
        </TitledGreyBox>
    );
};
