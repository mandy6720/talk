import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation } from "coral-framework/lib/relay";
import { Mutation as SetActiveTabMutation } from "coral-stream/App/SetActiveTabMutation";
import CLASSES from "coral-stream/classes";
import StreamModal from "coral-stream/common/StreamModal";
import {
  Button,
  ButtonIcon,
  Card,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components/v2";

import styles from "./AllCommentsLinks.css";

interface Props {
  showGoToDiscussions: boolean;
  showGoToProfile: boolean;
}

const AllCommentsLinks: FunctionComponent<Props> = ({
  showGoToDiscussions,
  showGoToProfile,
}) => {
  const { pym } = useCoralContext();
  const onGoToArticleTop = useCallback(() => {
    if (!pym) {
      return;
    }

    pym.scrollParentTo("");
  }, [pym]);
  const onGoToCommentsTop = useCallback(() => {
    if (!pym) {
      return;
    }

    pym.scrollParentToChildPos(0);
  }, [pym]);

  const setActiveTab = useMutation(SetActiveTabMutation);

  const onGoToDiscussions = useCallback(() => {
    void setActiveTab({ tab: "DISCUSSIONS" });
  }, [setActiveTab]);

  const onGoToProfile = useCallback(() => {
    void setActiveTab({ tab: "PROFILE" });
  }, [setActiveTab]);

  const classes = {
    sizeRegular: styles.sizeRegular,
    colorRegular: styles.colorRegular,
    active: styles.active,
    mouseHover: styles.mouseHover,
    disabled: styles.disabled,
  };

  const [showModal, setShowModal] = useState(false);
  const onShowModal = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);
  const onHideModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <div className={cn(styles.container, CLASSES.streamFooter.$root)}>
      {showModal && (
        <StreamModal onClose={onHideModal} open>
          {({ firstFocusableRef, lastFocusableRef }) => (
            <Card>
              <HorizontalGutter size="double">
                <HorizontalGutter>
                  <Typography variant="header2">
                    A modal on the Coral Stream?
                  </Typography>
                  <Typography>
                    Without security, usability, nor customization compromises?
                    <br />
                    <i>Amazing!</i>
                  </Typography>
                </HorizontalGutter>
                <Flex justifyContent="flex-end" itemGutter="half">
                  <Button
                    color="mono"
                    variant="outlined"
                    onClick={onHideModal}
                    ref={firstFocusableRef}
                  >
                    Yes
                  </Button>
                  <Button
                    color="stream"
                    onClick={onHideModal}
                    ref={lastFocusableRef}
                  >
                    I agree
                  </Button>
                </Flex>
              </HorizontalGutter>
            </Card>
          )}
        </StreamModal>
      )}
      <Button
        className={styles.link}
        onClick={onShowModal}
        variant="textUnderlined"
        color="regular"
        iconLeft
        classes={classes}
        uppercase={false}
      >
        <ButtonIcon className={styles.icon}>account_box</ButtonIcon>
        Show Modal
      </Button>
      {showGoToProfile && (
        <Button
          className={cn(styles.link, CLASSES.streamFooter.profileLink)}
          title="Go to profile and replies"
          onClick={onGoToProfile}
          variant="textUnderlined"
          color="regular"
          iconLeft
          classes={classes}
          uppercase={false}
        >
          <ButtonIcon className={styles.icon}>account_box</ButtonIcon>
          <Localized id="stream-footer-links-profile">
            <span>Profile and replies</span>
          </Localized>
        </Button>
      )}
      {showGoToDiscussions && (
        <Button
          className={cn(styles.link, CLASSES.streamFooter.discussionsLink)}
          title="Go to more discussions"
          onClick={onGoToDiscussions}
          variant="textUnderlined"
          color="regular"
          iconLeft
          classes={classes}
          uppercase={false}
        >
          <ButtonIcon className={styles.icon}>list_alt</ButtonIcon>
          <Localized id="stream-footer-links-discussions">
            <span>More discussions</span>
          </Localized>
        </Button>
      )}
      <Button
        className={cn(styles.link, CLASSES.streamFooter.commentsTopLink)}
        title="Go to top of comments"
        onClick={onGoToCommentsTop}
        variant="textUnderlined"
        color="regular"
        iconLeft
        classes={classes}
        uppercase={false}
      >
        <ButtonIcon className={styles.icon}>forum</ButtonIcon>
        <Localized id="stream-footer-links-top-of-comments">
          <span>Top of comments</span>
        </Localized>
      </Button>
      <Button
        className={cn(styles.link, CLASSES.streamFooter.articleTopLink)}
        title="Go to top of article"
        onClick={onGoToArticleTop}
        variant="textUnderlined"
        color="regular"
        iconLeft
        classes={classes}
        uppercase={false}
      >
        <ButtonIcon className={styles.icon}>description</ButtonIcon>
        <Localized id="stream-footer-links-top-of-article">
          <span>Top of article</span>
        </Localized>
      </Button>
    </div>
  );
};

export default AllCommentsLinks;
