---
layout: blocks
date: 2020-01-09T17:19:25.000+00:00
title: Hosted Repository
service_icon: database
service_color: "#4fa1e0"
weight: 3
render_page: true
description: A dedicated repository solution for your group or institution's data,
  managed by DataONE. Bring the products of your research lab, field station, or library
  together in a centralized location for efficient sharing, access, and reuse.
cta:
  type: subscribe form
  text: Join the waitlist
header:
  intro: Bring the products of your research together in one centralized location
    for efficient sharing, access, and reuse.
  template: header
  title: Your dedicated repository managed by DataONE
  type: hosted repository
  pill:
    template: pill
    text: Coming soon
    style: quaternary
  buttons:
  - template: button
    type: service cta
    color: primary
  - template: button
    type: contact
    color: tertiary
    text: Contact us
page_sections:
- intro: Let the experts behind DataONE manage and preserve your data, software, and
    derived products with our robust software and hardware.  Accelerate research activity,
    foster new collaborations, and build community with a repository that meets your
    needs and reflects your brand.
  template: section
  small_title: Introducing DataONE Hosted Repos
  title: Focus on your research, leave your data infrastructure to us
  type: default
  blocks:
  - template: columns
    num_cols: 3
    columns:
    - template: feature-detailed
      type: top
      headline: Private & public access
      text: Control access to your datasets prior to publication with collaborative
        groups or just keep it private
    - template: feature-detailed
      type: top
      headline: Usage metrics
      text: Understand how your data are being used over time with view, download,
        and citation metrics
    - template: feature-detailed
      type: top
      headline: Scalable storage
      text: Grow your 1 TB repository capacity based on your storage needs in 1 TB
        increments
  - image:
      template: image
      src: uploads/geographic-replicas.png
      alttext: Geographic replicas
      type: tilt-right
    headline: Geographic replicas
    template: feature-detailed
    text: Your data are replicated to distinct geographic regions for high availability
      and preservation.
    type: left
    details:
    - name: Preservation
      template: item-with-icon
      text: All data and metadata are replicated to two geographically independent
        data centers in California and Tennessee
      icon: map-pin
    - name: Customization
      template: item-with-icon
      text: Brand your data repository with customized features allowing you to connect
        directly with your community.
      icon: users
  - details:
    - template: item-with-icon
      name: Custom DOI prefix
      text: A DOI prefix is configured exclusively for your datasets, products, and
        code
      icon: star
    - template: item-with-icon
      name: Custom domain name
      text: Your repository is available at a domain of your choice, but hosted by
        DataONE
      icon: home
    image:
      template: image
      src: uploads/custom-domain-and-doi.png
      alttext: Custom Domain and DOI
      type: tilt-left
    headline: Customization
    template: feature-detailed
    text: Brand your data repository with customized features allowing you to connect
      directly with your community.
    type: right
  - template: button
    type: service cta
    color: primary
  - template: button
    type: 'internal page'
    color: 'quaternary'
    text: 'See all features'
    internal_link: 'services/_index.md'
- template: section
  icon: "bar-chart-2"
  background: data-wave
  small_title: Analytics
  title: Get a complete assessment of your data & metadata
  intro: With access to information about the datasets in your repository, you can
    monitor how your data is being used and assess its quality based on community
    established scores.
  blocks:
  - template: feature-detailed
    headline: Make your data FAIR
    text: Access aggregate & individual FAIR metadata assessment scores. Improve data discovery,
      accessibility, interoperability, and reusability with a quantitative metadata
      assessment using the FAIR principles.
    type: right
    image:
      template: image
      src: uploads/fair_reports/fair-for-hosted-repos.png
      alttext: Representation of FAIR products available to Hosted Repository users.
        A time series chart of aggregated FAIR metrics over time, and a stack of individual
        metadata assessment for each dataset. The individual assessment shows 38 metadata
        checks and an overall score for each of the four FAIR metrics (Findability,
        Accessibility, Interoperability, and Reusability)
      type: tilt-left
    details:
    - template: item-with-icon
      name: Time series charts
      text: Discover how FAIR scores change over time through time series charts
      icon: trending-up
    - template: item-with-icon
      name: Detailed analysis
      text: Drill down into detailed FAIR reports for individual datasets
      icon: file-plus
    button:
      template: button
      type: internal page
      color: quaternary
      text: More about FAIR
      internal_link: "/features/fair"
  - template: columns
    num_cols: 2
    alignment: left
    columns:
    - template: feature-detailed
      type: top
      text: Access aggregated view and download metrics for datasets
      headline: Usage metrics
    - template: feature-detailed
      type: top
      headline: Citation reports
      text: Find out who is citing your data
- template: section
  icon: "tool"
  small_title: Repository tools
  title: For users & `developers`
  intro: Open source, user friendly tools for working with DataONE across multiple
    levels of expertise. DataONE tools and services undergo extensive usability testing
    to ensure they meet community needs.
  blocks:
  - template: feature-detailed
    type: left
    image:
      template: image
      src: uploads/metacat-on-github.png
      alttext: Metacat on Github
      type: tilt-right
    headline: Open source repository platform
    text: "DataONE hosted repositories represent stand-alone deployments of open
      source DataONE tools:"
    details:
      - template: item-with-icon
        icon: metacat
        name: Metacat
        text: Metadata & data management server [Learn more](https://knb.ecoinformatics.org/knb/docs/)
      - template: item-with-icon
        icon: metacatui
        name: MetacatUI
        text: Search and metadata management web client  [Learn more](https://nceas.github.io/metacatui/)
    button:
      icon: github
      external_link: https://github.com/DataONEorg
      template: button
      text: DataONE on Github
      color: secondary
      type: external website
  - template: logos-bar
    title: Trusted by
    style: compact
    logos:
      - name: Knowledge Network for Biocomplexity
        logo: "/uploads/member_node_logos/knb.png"
      - name: Arctic Data Center
        logo: "/uploads/member_node_logos/arctic.png"
      - name: 'ESS-DIVE: Deep Insight for Earth Science Data'
        logo: "/uploads/member_node_logos/ess_dive1.png"
      - name: California Ocean Protection Council Data Repository
        logo: "/uploads/member_node_logos/ca_opc.png"
      - name: SANParks Data Repository
        logo: "/uploads/member_node_logos/sanparks.png"
      - name: Organization for Tropical Studies
        logo: "/uploads/member_node_logos/ots_ndc.png"
      - name: PISCO MN
        logo: "/uploads/member_node_logos/pisco.png"
      - name: Taiwan Forestry Research Institute
        logo: "/uploads/member_node_logos/tfri.png"
      - name: Montana IoE Data Repository
        logo: "/uploads/member_node_logos/ioe.png"
      - name: "Dangermond Preserve"
        logo: "/uploads/dangermond_logo.png"
      - name: "DataONE Search"
        logo: "uploads/Logo-DataONESearch_compact.png"
  - template: columns
    num_cols: 2
    columns:
    - template: feature-detailed
      type: top
      button:
        type: external website
        template: button
        color: quaternary
        external_link: https://demo.arcticdata.io/submit
        text: See a demo
      headline: Easy data upload user interface
      text: The user friendly data submission tool helps your researchers effortlessly
        upload data and create metadata to enhance interoperability, reusability,
        and value of data.
      image:
        template: image
        src: uploads/metadata-editor.png
        alttext: Metadata Editor
        type: float
      details: []
    - template: feature-detailed
      type: top
      button:
        template: button
        color: quaternary
        external_link: https://releases.dataone.org/online/api-documentation-v2.0.1/apis/index.html
        text: Read the docs
        type: external website
      headline: Advanced API access
      text: Programmatically work with your repository through the DataONE tools in
        `R`, `Python`, `Matlab`, and `Java`.
      image:
        template: image
        src: uploads/dataone-r-api.png
        alttext: DataONE R API
        type: float
      details: []
  - template: columns
    num_cols: 3
    columns:
    - template: card
      icon: search
      title:  Comprehensive search
      description: Quickly find data with detailed search filters, or by navigating the interactive
        map
    - template: card
      icon: file
      title: Any file format
      description: 'Use the scientific file formats for your community: image, tabular, text,
        audio, video, and others'
    - template: card
      icon: link
      title: Link data and software
      description: Easily show how your files relate to each other by providing well-described provenance workflows.
  - template: button
    type: service cta
    color: primary
- template: section
  background: subtle-emphasis
  icon: plus
  title: Includes DataONE Plus
  intro: Along with your Hosted Repository, get all of the features that are included with DataONE Plus
  blocks:
    - template: page-summary
      service: services/plus.md
- template: section
  background: major-accent-color
  title: Interested in a hosted repository?
  intro: Enhanced DataONE services are currently available on a limited basis as part
    of a beta program. Please provide the information below and we’ll get in touch
    when these services are ready for your organization.
  blocks:
  - template: join-form
    precheck_hostedrepo: true
    precheck_plus: false
    precheck_mailing_list: false
menu:
  primary_nav:
    weight: 3
    parent: Services
    post: A dedicated repository for your data
  footer:
    weight: 3
    parent: Services
---
