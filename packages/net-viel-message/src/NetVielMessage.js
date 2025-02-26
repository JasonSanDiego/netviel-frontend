import { html, css, LitElement } from 'lit-element';
import '@polymer/iron-list/iron-list.js';
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import { prettyDate } from "../../net-viel-list/src/NetVielList.js"
import { apiHost } from "../../net-viel/src/NetViel.js"


export class NetVielMessage extends LitElement {
  static get styles() {
    return css`
      :host {
      }
      
      .message-container {
        border-top: 1px solid #e3e3e3;
        margin-bottom: 1em;
        padding-top: 1em;
        padding-bottom: 2em;
        max-width: 100%;
      }

      .from {
        font-weight: 500;
        font-size: 0.9em;
        margin-bottom: 0em;
        margin-top: 0em;
      }
      .subject, .to {
        font-weight: 400;
        font-size: 0.9em;
        margin-bottom: 0em;
        margin-top: 0em;
        opacity: 0.65;
      }

      .date {
        float: right;
        margin-top: 0;
      }
      
      .content {
        margin-top: 2em;
        margin-left: 0;
        margin-right: 0;
      }

      #content-text pre {
        font-size: 16px;
        color: #555555;
        font-family: Roboto;
        white-space: pre-wrap;
      }

      .attachments h3 {
        font-size: 1.4em;
        font-weight: 300;
        margin-bottom: 0.5em;
      }

      .attachments ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
      }

      a:link, a:visited {
        color: #3366aa;
      }
      a:link, a:visited, a:hover, a:active {
        text-decoration: None;
      }

      div.download {
        float: right;
        position: relative;
        bottom: 0.4em;
        margin-right: 0.5em;
      }

      div.download paper-icon-button {
        color: #888888;
      }
    `;
  }

  static get properties() {
    return {
      message: { type: Object },
    };
  }

  constructor() {
    super();
    this.message = {};
  }

  updated() {
    if (this.message.content_type == 'text/html') {
      this.shadowRoot.querySelector('#content-html').innerHTML = this.message.content;
    } else {
      this.shadowRoot.querySelector('#content-text').innerHTML = `<pre>${  this.message.content  }</pre>`;
    }

  }

  render() {
    return html`
    <div class="message-container">
      <p class="date">${prettyDate(Date.parse(this.message.date) / 1000)}</p>
      <div class="download">
        <a href="${apiHost()}/api/message/${this.message.message_id}">
          <paper-icon-button icon="file-download"></paper-icon-button>
        </a>
      </div>
      <p class="from">From: ${this.message.from}</p>
      <p class="to">To: ${this.message.to}</p>
      ${this.message.cc ? html`<p class="to">CC: ${this.message.cc}</p>` : ''}
      ${this.message.bcc ? html`<p class="to">BCC: ${this.message.bcc}</p>` : ''}
      <p class="subject">Subject: ${this.message.subject}</p>
      <div class="content">
        <div id="content-html"></div>
        <div id="content-text"></div>
      </div>
      ${this.message.attachments.length > 0 ? html`<div class="attachments">
        <h3>Attachments</h3>
        <ul>
        ${this.message.attachments.map((attachment, i) => html`<li><a href="${apiHost()}/api/attachment/${this.message.message_id}/${i}" target="_new">${attachment.filename}</a></li>`)}
        </ul>
      </div>` : ''}
    </div>
    `;
  }
}
