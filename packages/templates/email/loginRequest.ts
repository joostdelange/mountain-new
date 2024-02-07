import type { AxiosInstance } from 'axios';

export const loginRequestEmail = async (mjmlHttp: AxiosInstance, data: { firstName: string, domain: string, code: string }, assetBucketUrl: string) => ({
  subject: 'Login request for Mountain CMS',
  html: (await mjmlHttp.post<{ html: string }>('/render', {
    mjml: /* html */`
      <mjml>
        <mj-head>
          <mj-title>Login request for Mountain CMS</mj-title>
          <mj-preview>Login request for Mountain CMS</mj-preview>
          <mj-attributes>
            <mj-all font-family="'Roboto', sans-serif"></mj-all>
            <mj-text font-weight="400" font-size="16px" color="#222222" line-height="24px" font-family="'Roboto', sans-serif"></mj-text>
          </mj-attributes>
          <mj-style inline="inline"></mj-style>
          <mj-style inline="inline">
            .body-class {padding: 30px}
            .body-wrapper {border-radius: 6px;overflow: hidden}
            .body-section {box-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1)}
          </mj-style>
        </mj-head>
        <mj-body background-color="#e5e7eb" css-class="body-class">
          <mj-wrapper padding-top="0" padding-bottom="0" css-class="body-wrapper">
            <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" css-class="body-section">
              <mj-column>
                <mj-image src="${assetBucketUrl}/logo.png" width="50px" align="center"></mj-image>
                <mj-text font-weight="400" font-size="24px" align="center" padding-bottom="30px">Login request for Mountain CMS</mj-text>
                <mj-text>Hello ${data.firstName},</mj-text>
                <mj-text>You have received this email because a (passwordless) login request was done from ${data.domain}.</mj-text>
                <mj-text>The following code is needed to complete the login:</mj-text>
              </mj-column>
            </mj-section>
            <mj-section background-color="#ffffff" padding-top="0" padding-bottom="0" padding-left="40px" padding-right="40px" css-class="body-section">
              <mj-column background-color="#f3f4f6" border-radius="4px">
                <mj-text font-size="24px" font-weight="bold" color="#222222" align="center">${data.code}</mj-text>
              </mj-column>
            </mj-section>
            <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" css-class="body-section">
              <mj-column>
                <mj-text>To complete the login, fill this code into the field on the view you came from.</mj-text>
                <mj-divider border-width="1px" border-color="#e5e7eb" padding-top="20px"></mj-divider>
                <mj-text font-size="13px" color="#6b7280" padding-bottom="20px">If you have any questions, feel free to contact the administrator of Mountain CMS</mj-text>
              </mj-column>
            </mj-section>
          </mj-wrapper>
        </mj-body>
      </mjml>
    `,
  })).data.html,
});
